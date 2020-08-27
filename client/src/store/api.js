import pkg from '@reduxjs/toolkit'
const { createAction } = pkg

export const apiCallBegan = createAction('api/callBegan')
export const apiCallSuccess = createAction('api/callSuccess')
export const apiCallFailed = createAction('api/callFailed')
