import db from '../db/connect';
import * as bcrypt from 'bcryptjs';
import { Observable } from 'rxjs';
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';

export default class Login {
    req: Request;
    res: Response;
    connection: any;

    constructor() {
        // this.req = req;
        // this.res = res;
        this.connection = db.getConnection();
    }

    // bcrypt.compareSync('somePassword', hash)
    login(req, res) {
        console.log(req.body.email);
        this.connection.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, results, fields) => {
            console.log(results, results.length);
            console.log();
            if (results.length > 0) {
                console.log('found');
                bcrypt.compare(req.body.password, results[0].password, function (err, match) {
                    if (match) {
                        console.log('matched');

                        const user = { username: req.body.username, password: req.body.password };
                        const accessToken = jwt.sign(user, process.env.AUTH_KEY);
                        res.json({
                            result: true,
                            userName: req.body.email,
                            role: 'manager',
                            accessToken
                        });
                    } else {
                        res.json([{
                            result: false
                        }]);
                    }
                });
            } else {
                res.json([{
                    result: false
                }]);
            }
        });
        // res.json([{
        //     result: 'ok'
        // }]);
    }
}

//export default new Register();