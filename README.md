# url-minifier
An API for url shortening to be directly used in your projects.

## Usage

### For Shortening of URL

Make a **POST** request at `/minify` endpoint with parameter **longURI** in body. You'll receive a JSON Object. Use key `antURI` to get the minified URL.
