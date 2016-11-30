const { render, default: router, ...utils } = ($ES.CONTEXT == 'NODE') ? require('./server') : require('./client')

export { render, utils }
export default router

