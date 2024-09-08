// const { app } = require('@azure/functions');
import {app} from '@azure/functions';
import { testFunction } from './functions/test-function.js';

app.setup({
    enableHttpStream: true,
});

app.http('test-function',{
    methods:['POST'],
    authLevel:'anonymous',
    handler:testFunction,
});