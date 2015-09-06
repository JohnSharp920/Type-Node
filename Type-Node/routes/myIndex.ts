import express = require('express');

export function myIndex(req: express.Request, res: express.Response) {
    res.render('myIndex', { title: 'Express' });
};
