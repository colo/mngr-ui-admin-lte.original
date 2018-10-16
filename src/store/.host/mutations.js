
import Vue from 'vue'

// export const data = function(state, payload) {//generic mutation
//   if(Array.isArray(payload.value)){
//
//     if(!state.stats[payload.path])
//       Vue.set(state.stats, payload.path, {})
//
//     Vue.set(state.stats[payload.path], payload.key, payload.value)
//
//   }
//   else {
//
//     if(!state.stats[payload.path])
//       Vue.set(state.stats, payload.path, {})
//
//     if(!state.stats[payload.path][payload.key])
//       Vue.set(state.stats[payload.path], payload.key, [])
//
//     state.stats[payload.path][payload.key].push(payload.value)
//   }
// }
//
// export const splice = (state, payload) => {
//
//   if(state.stats[payload.path] && state.stats[payload.path][payload.key]){
//     let length = state.stats[payload.path][payload.key].length
//     state.stats[payload.path][payload.key].splice(
//       -payload.length -1,
//       length - payload.length
//     )
//   }
// }

export const add = (state, payload) => {
  let {id, pipeline} = payload
  if(!state.pipelines[id])
    Vue.set(state.pipelines, id, null)

  state.pipelines[id] = pipeline
}

export const set = (state, pipelines) => {
  Array.each(pipelines, function(payload){
    // let {id, pipeline} = payload
    // if(!state.pipelines.contains(pipeline))
    //   state.pipelines.push(pipeline)
    add(state, payload)
  })
  Object.each(state.pipelines, function(payload){
    let {id, pipeline} = payload
    if(!pipelines.contains(payload))
      erase(state, id)
  })
  // Vue.set(state, 'all', hosts)
}

export const erase = (state, id) => {
  Vue.set(state.pipelines, id, undefined)
  // if(state.pipelines.contains(pipeline)){
  //   let tmp_array = Array.clone(state.pipelines)
  //   tmp_array.erase(pipeline)
  //   Vue.set(state, 'pipelines', tmp_array)
  // }
}

export const clear = (state) => {
  Vue.set(state, 'pipelines', {})
}
