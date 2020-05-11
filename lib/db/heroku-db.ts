import * as mysql from "mysql";
import { Observable } from 'rxjs';

class HerokuDBConnect {
    connection;
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'cvd'
        });
    }
    getConnection() {
        return this.connection;
    }
    connect(): Observable<any> {
        const observable = new Observable(subscriber => {

            this.connection.connect((err) => {
                if (err) throw err;
                subscriber.next(this.connection);
            });
        });

        return observable;
    }
    getUsers(): Observable<any> {
        const observable = new Observable(subscriber => {
            this.connect().subscribe(res => {
                this.connection.query('SELECT * FROM authors', (err, rows) => {
                    if (err) throw err;

                    console.log('Data received from Db:');
                    console.log(rows);
                    subscriber.next(rows);
                });
            }, err => { });
        });
        return observable;
    }

    disconnet() {
        this.connection.end();
    }
}

export default new HerokuDBConnect();