const errorHandle = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor inesperado';

    console.error(
        `[ERROR] ${new Date().toLocaleString} - ${statusCode} - ${message} `);

    if(err.stack) {
        console.error(err.stack);
    } 

    res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });

}

module.exports = errorHandle;