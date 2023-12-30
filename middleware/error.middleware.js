const globalError = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    
    sendError(error, res);
};

const sendError = (error, res) => {
    return res.status(404).json({
        statusCode: error.statusCode,
        status: error.status,
        message: error.message,
        stack: error.stack
    });
};

module.exports = globalError;