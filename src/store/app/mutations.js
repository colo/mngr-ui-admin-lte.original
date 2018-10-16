 // export const paths = (state, payload) => {
 //  if(Array.isArray(payload)){
 //    state.paths = payload
 //  }
 //  else {
 //    state.paths.push(payload)
 //  }
 // }

 import Vue from 'vue'

 export const doc = (state, payload) => {
  if(!state.docs[payload.type])
    Vue.set(state.docs, payload.type, null)

  state.docs[payload.type] = payload.value
 }

 // export const search = (state, doc) => {
 //  state.docs.search = doc
 // }

 export const paths = (state, paths) => {
   Array.each(paths, function(path){
     if(!state.paths.contains(path))
       state.paths.push(path)
   })
   Array.each(state.paths, function(path){
     if(!paths.contains(path))
       state.paths.erase(path)
   })
   // Vue.set(state, 'all', hosts)
 }

 export const reset = (state, bool) => {
  state.reset = bool
 }
 export const suspend = (state, bool) => {
  state.suspend = bool
 }
 export const pause = (state, bool) => {
  state.pause = bool
 }
 export const freeze = (state, bool) => {
  state.freeze = bool
 }

 export const range = (state, payload) => {
   // console.log('range mutation', payload)
   state.range = [payload.start, payload.end]
 }

 export const charts_tree_menu = (state, menu) => {
   state.charts_tree_menu = menu
 }

 export const docs_per_sec = (state, docs) => {
   state.docs_per_sec = docs
 }
