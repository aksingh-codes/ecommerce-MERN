class ApiFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString 
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        } : {}

        this.query.find({
            ...keyword
        })

        return this
    }

    filter() {
        const copyOfQueryString = {...this.queryString}
        
        // Removing some fields for category
        const removeFields = ["keyword", "page", "limit"]
        removeFields.forEach(
            key => delete copyOfQueryString[key]
        )

        // Filter for price and rating
        let queryString = JSON.stringify(copyOfQueryString)
        queryString = queryString.replace(
            /\b(gt|gte|lt|lte)\b/g, key => `$${key}`
        )

        this.query = this.query.find(
            JSON.parse(queryString)
        )

        return this
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1

        const skip = resultPerPage * (currentPage - 1)

        // limit and skip are mongoDB functions 
        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeatures