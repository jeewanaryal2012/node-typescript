
class Interceptor {
    isAuth(req, res, next) {
        let timeStamp = req.headers['timestamp'];
        let method = req.method;
        console.log('here: ', timeStamp);
        let x = 'validTimeStamp';
        if (x === 'validTimeStamp') {
            return next();
        } else {
            res.json({
                message: 'login expired just now'
            });
        }
    }
}

export default new Interceptor();