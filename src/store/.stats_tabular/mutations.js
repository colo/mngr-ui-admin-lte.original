import Vue from 'vue'

export const add = function(state, payload) {//generic mutation
  // console.log('MUTATION', payload.data)

  if(!state[payload.host])
    Vue.set(state, payload.host, {})

  if(!state[payload.host][payload.path])
    Vue.set(state[payload.host], payload.path, {})

  if(!state[payload.host][payload.path][payload.key])
    Vue.set(state[payload.host][payload.path], payload.key, undefined)

  let value = undefined
  if(Array.isArray(payload.data)){
    // Vue.set(state[payload.host][payload.path], payload.key, payload.value)

    //get doc with highest timestamp
    value = Math.max.apply(Math, payload.data.map(function(o) { return o.timestamp; }))
  }
  else{
    value = payload.data
  }
  // else {
  //   if(!state[payload.host][payload.path][payload.key])
  //     Vue.set(state[payload.host][payload.path], payload.key, [])
  //
  //
  // }

  // Vue.set(state[payload.host][payload.path], payload.key, value)
  state[payload.host][payload.path][payload.key] = value
}

export const clear = (state, payload) => {
  //console.log('clear mutation')

  if(!state[payload.host])
    Vue.set(state, payload.host, {})

  if(!state[payload.host][payload.path])
    Vue.set(state[payload.host], payload.path, {})

  if(!state[payload.host][payload.path][payload.key])
    Vue.set(state[payload.host][payload.path], payload.key, undefined)


}
//
// export const splice = (state, payload) => {
//
//   if(state[payload.host]
//     && state[payload.host][payload.path]
//     && state[payload.host][payload.path][payload.key]
//   ){
//     let length = state[payload.host][payload.path][payload.key].length
//     state[payload.host][payload.path][payload.key].splice(
//       -payload.length -1,
//       length - payload.length
//     )
//   }
// }
