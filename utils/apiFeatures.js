class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  pagination(countDocument) {
    const page = this.mongooseQuery.page * 1;
    const limit = this.mongooseQuery.limit * 5;
    const skip = (page - 1) * 5;

    const pagination = [
      {
        currentPage: page,
        limit: limit,
        numberOfPage: Math.ceil(countDocument / limit),
      },
    ];

    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    this.paginationResult = pagination;
  }
}

module.exports = ApiFeatures;