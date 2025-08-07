const LoggerMiddleware = (req, res, next) => {
    const timesttamp = new Date().toISOString();
    console.log(`[${timesttamp} ${req.method} ${req.url} --IP: ${req.ip}]`);
    
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timesttamp} Res: ${res.statusCode} completed in ${duration}ms`);
    });

    next();
}

module.exports = LoggerMiddleware;