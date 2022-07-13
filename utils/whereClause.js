// base - Product.find()
// base - Product.find(email:{"sonijayesh12345@gmail.com"})

// bigQuery - /search=coder&page=2&category=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199&limit=5

class WhereClause {
    constructor(base, bigQuery) {
        this.base = base;
        this.bigQuery = bigQuery;
    }
    search() {
        const searchWord = this.bigQuery.search ? {
            name: {
                $regex: this.bigQuery.search,
                $option: 'i' // case insensitivity search
            }
        } : {}
        this.base = this.base.find({ ...searchWord });
        return this;
    }

    filter() {
        const copiedBigQuery = { ...this.bigQuery };

        delete copiedBigQuery["search"];
        delete copiedBigQuery["limit"];
        delete copiedBigQuery["page"];

        // convert BigQuery into a string => copiedBigQuery
        let stringOf_copiedBigQuery = JSON.stringify(copiedBigQuery);

        stringOf_copiedBigQuery = stringOf_copiedBigQuery.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`);

        const jsonOf_copiedBigQuery = JSON.parse(stringOf_copiedBigQuery);

        this.base = this.base.find(jsonOf_copiedBigQuery);
        return this;
    }

    pager(resultPerPage) {
        let currentPage = 1;
        if (this.bigQuery.page) {
            currentPage = this.bigQuery.page
        }
        const pageValuesToBeSkip = resultPerPage * (currentPage - 1);
        this.base = this.base.limit(resultPerPage).skip(pageValuesToBeSkip);
        return this;
    }
}

module.exports = WhereClause;