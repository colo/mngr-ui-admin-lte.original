// // import PouchDB from 'pouchdb'
// import websql from 'pouchdb-adapter-websql'
// // import memory from 'pouchdb-adapter-memory'
//
// // import * as $PouchDB from 'pouchdb-browser'
// import * as $PouchDB from 'pouchdb'
// let PouchDB = $PouchDB['default']
//
// PouchDB.plugin(websql)
//
// let db = new PouchDB('live', {adapter: 'websql'})

import PouchDB from 'pouchdb-browser'
// let db = new PouchDB('live')

//
// import ddocs from '@libs/_views/sort'
//
// Array.each(ddocs, function(ddoc){
//   db.put(ddoc).then(function (info) {
//     //////// console.log('sortView info', info)
//
//   }).catch(function (err) {
//     //////// console.log('sortView err', err)
//   });
//
//   let keys = Object.keys(ddoc.views)
//
//   Array.each(keys, function(key){
//     let doc = ddoc._id.replace('_design/', '')+'/'+key
//     //////// console.log('quering', doc)
//     db.query(doc, {
//       limit: 0 // don't return any results
//     }).then(function (res) {
//       //////// console.log('build index res', res)
//     }).catch(function (err) {
//       //////// console.log('build index err', err)
//     });
//
//   })
//
// })
//
// // // // import PouchDB from 'pouchdb-memory'
// // // PouchDB.plugin(require('pouchdb-adapter-memory'))
// // //
// // let mem = new PouchDB('MemStats', {adapter: 'memory'})

import Deque from 'double-ended-queue'

const QUEUE_SIZE = 300 //os = 4 docs...1200 = 300 secs of docs

// let deque = new Deque()//QUEUE_SIZE
let queues = {}
let dbs = {}
// let compacted = false

let get_queue = function(payload, arr){
  // // console.log('ACTIONS get_queue', payload)
  if(!queues[payload.host])
    queues[payload.host] = {}

  if(!queues[payload.host][payload.path])
    queues[payload.host][payload.path] = {}

  if(!queues[payload.host][payload.path][payload.key])
    queues[payload.host][payload.path][payload.key] = new Deque()

  if(arr)
    queues[payload.host][payload.path][payload.key] = new Deque(arr)

  return queues[payload.host][payload.path][payload.key]
}

let get_db = function(host){
  console.log('ACTIONS get_db', host)
  if(!dbs[host]){
    dbs[host] = {}
    dbs[host].flushing = false
    dbs[host].conn = new PouchDB('tabular_live_'+host)
  }

  // dbs[host].conn.info().then(function (result) {
  //   console.log('INFO', result)
  // }).catch(function (err) {
  //   dbs[host].flushing = false
  //   dbs[host].conn = new PouchDB('tabular_live_'+host)
  // });

  return dbs[host]
}
let close_db = function(host, cb){
  // console.log('ACTIONS get_db', host)
  // if(dbs[host] && typeof dbs[host].close == 'function'){
  //   dbs[host].close(() => {delete dbs[host]; cb()})
  // }
  // else if(dbs[host]){
    delete dbs[host]
    cb()
  // }



  // return dbs[host]
}

export const list_queues = ({ commit, dispatch }, payload) => {
  return new Promise((resolve, reject) => {
    let list_queues = []

    if(payload.path && queues[payload.host] && queues[payload.host][payload.path]){
      list_queues = Object.keys(queues[payload.host])
    }
    else if(payload.host && queues[payload.host]){
      list_queues = Object.keys(queues[payload.host])
    }

    // return list_queues
    resolve(list_queues)
  })
}

export const get = ({ commit, dispatch }, payload) => {
  // let db = new PouchDB('tabular_live_'+payload.host)
  let db = get_db(payload.host)
  let deque = get_queue(payload)
  //// console.log('action get...')

  return new Promise((resolve, reject) => {
    let length = payload.length || deque.length
    let range = payload.range || []
    let docs = []



    if(deque.length > 0){
      let arr = deque.toArray()
      //////// console.log('fetching deque.length', deque.length, arr)
      // let reg = new RegExp(payload.path+'\/'+payload.host)
      while (length > 0 && arr.length > 0){
        // //////// console.log('fetching while...', length)
        let doc = arr.pop()
        // delete doc._rev
        if(doc._id.indexOf(payload.path+'/'+payload.key) > -1){
          ////// console.log('DOC', doc, (doc.metadata.timestamp > range[0] && doc.metadata.timestamp < range[1]))
          if(
            payload.range && (doc.metadata.timestamp > range[0] && doc.metadata.timestamp < range[1])
            || !payload.range
          ){

            // if(doc.metadata.timestamp > range[0])
            //   range[0] = doc.metadata.timestamp

            docs[length - 1] = doc
            length--
          }

        }
      }
    }

    ////// console.log('fetching doc', docs, range)

    if(length > 0 || payload.range){//from db
      let options = {
        startkey: payload.path+'/'+payload.key+'\ufff0',
        endkey: payload.path+'/'+payload.key,
        inclusive_end: true,
        descending: true,
        include_docs: true
      }

      if(payload.length){
        options.limit = length
      }

      if(payload.range){
        // let range = payload.range
        options.startkey = payload.path+'/'+payload.key+'@'+range[1]+'\ufff0'
        options.endkey = payload.path+'/'+payload.key+'@'+range[0]
      }

      // console.log('action get OPTIONS', options)

      // let get_all = function(){
      //   let db = get_db(payload.host)
      //   if(db.flushing == false){


          db.conn.allDocs(options).then(function (res) {


            res.rows.reverse()
            while (length > 0 && res.rows.length > 0){
              //////// console.log('fetching while...', length)
              docs[length] = res.rows.pop().doc
              length--
            }



            docs.sort(function(a,b) {
              return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
            })
            docs = docs.clean()
            // // console.log('fetching from db', docs)
            console.log('action get...from db', docs.clean())
            resolve(docs)
          }).catch(function (err) {
            //////// console.log('fetching from db err', err)
            docs.sort(function(a,b) {
              return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
            })
            resolve(docs)
          })


      //   }
      // }

      // if(db.flushing == false){
      //   console.log('NOT flushing')
      //   get_all()
      // }
      // else{
      //   let timeout = setTimeout(function(){
      //     let db = get_db(payload.host)
      //     if(db.flushing == false){
      //       console.log('NOT flushing clear')
      //       clearTimeout(timeout)
      //       get_all()
      //     }
      //     else{
      //       console.log('IS flushing')
      //     }
      //   }, 100)
      // }
    }
    else{
      docs.sort(function(a,b) {
        return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
      })
      resolve(docs)
    }

    // setTimeout(() => {
    //   // commit('someMutation')
    //   //////// console.log('stats get')
    //   resolve()
    // }, 1000)
  })
}

export const add = ({ commit, dispatch }, payload) => {
  // let db = new PouchDB('tabular_live_'+payload.host)
  // let db = get_db(payload.host)
  let deque = get_queue(payload)
  console.log('action add...', payload.data)
  // //////// console.log('length', deque.length)

  // if(deque.length >= QUEUE_SIZE)
  //   dispatch('flush', payload)


  if(Array.isArray(payload.data) && payload.data.length > 1){
    //firts sort data by timestamp
    payload.data.sort(function(a,b) {return (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0);} );

    // // console.log('ACTION', deque.toArray(), payload.data)

    // let docs = []
    Array.each(payload.data, function(data, index){
      let doc = new Object()
      doc._id = payload.path+'/'+payload.key+'@'+data.timestamp
      doc.data = data.value
      doc.metadata = new Object()
      doc.metadata.timestamp = data.timestamp
      doc.metadata.host = payload.host
      doc.metadata.path = payload.path+'/'+payload.key
      // doc.metadata.key = payload.key
      doc.metadata.type = 'periodical'
      // docs.push(doc)
      // if(deque.isEmpty() || deque.peekBack().metadata.timestamp < doc.metadata.timestamp)
      deque.push(doc)


    })


    commit('add', {
      host: payload.host,
      path:payload.path,
      key:payload.key,
      data: {
        timestamp: deque.peekBack().metadata.timestamp,
        value: deque.peekBack()
      }
    })
  }
  else{
    if(Array.isArray(payload.data))
      payload.data = payload.data[0]

    let doc = new Object()
    doc._id = payload.path+'/'+payload.key+'@'+payload.data.timestamp
    doc.data = payload.data.value
    doc.metadata = new Object()
    doc.metadata.timestamp = payload.data.timestamp
    doc.metadata.host = payload.host
    doc.metadata.path = payload.path+'/'+payload.key
    // doc.metadata.key = payload.key
    doc.metadata.type = 'periodical'

    // if(deque.isEmpty() || deque.peekBack().metadata.timestamp < doc.metadata.timestamp){
    deque.push(doc)

    // deque.push(doc)
    // commit('add', doc)
    commit('add', {
      host: payload.host,
      path:payload.path,
      key:payload.key,
      data: {
        timestamp: doc.metadata.timestamp,
        value: doc
      }
    })
    // }

  }

  // console.log('actions add', payload.host, payload.path, payload.key, deque.length)
  if(deque.length >= QUEUE_SIZE){
    console.log('actions add FLUSH', deque.length, QUEUE_SIZE)
    payload.remaing = 0 //QUEUE_SIZE
    dispatch('flush', payload)
  }

}

export const flush_all = ({ commit, dispatch }, payload) => {
  dispatch('list_queues', payload).then(function(paths){
    Array.each(paths, function(path){
      payload.path = path
      dispatch('list_queues', payload).then(function(keys){
        Array.each(keys, function(key){
          payload.key = key
          dispatch('flush', payload)
        })
      })
    })
  })
  // Array.each(dispatch('list_queues', payload), function(path){
  //   payload.path = path
  //   console.log('flush_all', payload)
  //
  //   Array.each(dispatch('list_queues', payload), function(key){
  //     payload.key = key
  //     dispatch('flush', payload)
  //   })
  // })
}

export const flush = ({ commit, state }, payload) => {
  // let db = new PouchDB('tabular_live_'+payload.host)
  let db = get_db(payload.host)
  let length = payload.remaing
  let deque = get_queue(payload)
  // console.log('action flushing...', payload.host, payload.path, payload.key)


  if(deque.isEmpty() !== true){
    let docs = Array.clone(deque.toArray())
    deque.clear()

    docs.sort(function(a,b) {
      return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
    } );


    let deque_arr = []
    if(length && length > 0){
      while(length > 0){
        // let doc = docs.pop()
        deque_arr.unshift(docs.pop())
        length--
      }

      deque_arr = deque_arr.clean()
    }

    deque = get_queue(payload, deque_arr)

    console.log('action flushing...', length, payload.host, payload.path, payload.key,docs, deque.toArray())

    db.flushing = true
    db.conn.bulkDocs(docs)
    .then(function (status) {
      console.log('flushed', docs, status, deque.toArray())
      // commit('clear', payload)
      db.flushing = false
    }).catch(function (err) {
      console.log('flushed err', err)
    })
  }

}

export const splice = ({ commit, state }, payload) => {
  // let db = new PouchDB('tabular_live_'+payload.host)
  let db = get_db(payload.host)
  let length = payload.length
  // let deque = get_queue(payload)

  let options = {
    // startkey: payload.host+'/'+payload.path+'/'+payload.key+'\ufff0',
    // endkey: payload.host+'/'+payload.path+'/'+payload.key,
    // limit: length,
    inclusive_end: true,
    descending: true,
    include_docs: true
  }

  if(payload.length){
    options.limit = length
  }

  if(payload.range){
    let range = payload.range
    options.startkey = payload.host+'/'+payload.path+'/'+payload.key+'@'+range[1]+'\ufff0'
    options.endkey = payload.host+'/'+payload.path+'/'+payload.key+'@'+range[0]
  }

  ////// console.log('OPTIONS', options)

  db.conn.allDocs(options).then(function (res) {

    // console.log('splice fetching res', res)


    res.rows.reverse()


    db.conn.destroy().then(function (status) {
      console.log('splice destroy res', status)
      // db = new PouchDB('tabular_live_'+payload.host)
      close_db(payload.host,() => {
        db = get_db(payload.host)


        // console.log('splice DOCS', res.rows)

        db.conn.bulkDocs(res.rows)
        .then(function (status) {
          console.log('splice bulkDocs status', status)

        }).catch(function (err) {
          console.log('splice bulkDocs err', err)

        })
      })


    }).catch(function (err) {
      console.log('splice destroy err', err)
    })
    // while (length > 0 && res.rows.length > 0){
    //   //////// console.log('fetching while...', length)
    //   docs[length] = res.rows.pop().doc
    //   length--
    // }
    //
    //
    //
    // docs.sort(function(a,b) {
    //   return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
    // })
    // // // console.log('fetching from db', docs)
    // resolve(Array.clean(docs))
  }).catch(function (err) {
    // console.log('splice fetching from db err', err)
    // docs.sort(function(a,b) {
    //   return (a.metadata.timestamp > b.metadata.timestamp) ? 1 : ((b.metadata.timestamp > a.metadata.timestamp) ? -1 : 0)
    // })
    // resolve(Array.clean(docs))
  })

}

// export const splice = ({ commit, state }, payload) => {
//   //// console.log('action splice', payload)
//   // let spliced = state[payload.host][payload.path][payload.key]
//   let _id = payload.host+'/'+payload.path+'/'+payload.key
//
//   //////// console.log('splice', state[payload.host][payload.path][payload.key].length)
//
//   db.allDocs({
//     // startkey: spliced.split('@')[0],
//     // endkey: spliced.split('@')[0]+'\ufff0'
//     startkey: _id,
//     endkey: _id+'\ufff0'
//   }).then(function (result) {
//     //////// console.log('allDocs result', result);
//     // // handle result
//
//     let deleted = []
//
//     Array.each(result.rows, function(row){
//       // //////// console.log('result', row);
//       let doc = {}
//       if(!_id.contains(row.id)){
//         doc['_deleted'] = true
//         doc['_id'] = row.id
//         doc['_rev'] = row.value.rev
//         deleted.push(doc)
//       }
//
//     })
//
//     //////// console.log('to delete', deleted)
//     if(deleted.length > 0){
//       db.bulkDocs(deleted).then(function (result) {
//         //// console.log('action bulkDocs delete result', result);
//
//         if(compacted === false){
//           compacted = true
//           db.compact().then(function (result) {
//             //// console.log('action compact result ',result);
//             compacted = false
//           }).catch(function (err) {
//             //// console.log('action  compact err ',err);
//           });
//         }
//
//       }).catch(function (err) {
//         //// console.log('action  bulkDocs delete err', err);
//       });
//     }
//   }).catch(function (err) {
//     //// console.log('action allDocs', err);
//   });
//
// }
