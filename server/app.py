import json
from flask import Flask, request, render_template, jsonify
from flask_cors import cross_origin, CORS
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


class ItemData:
    def __init__(self, category, items_file_path, reviews_file_path):
        self.category = category
        self.items = {}
        self.reviews = []
        self.read_data(items_file_path, reviews_file_path)

    def read_data(self, items_file_path, reviews_file_path):
        print("[INFO] Loading data for category " + self.category + "...")
        with open(items_file_path) as file:
            for jsonObj in file:
                item_json = json.loads(jsonObj)
                self.items[item_json['asin']] = item_json
        with open(reviews_file_path) as file:
            for jsonObj in file:
                review = json.loads(jsonObj)
                self.reviews.append(review)
        print("[INFO] Success.")


data = {
    "MAGAZINE": ItemData('magazine', './data/meta_Magazine_Subscriptions.json', './data/Magazine_Subscriptions.json'),
    #"OFFICE_PRODUCTS": ItemData('office_products', './data/meta_Office_Products.json', '')
}


@app.route('/')
def index_cb():
    return render_template("./index.html")


@app.route('/items/')
@cross_origin()
def items_cb():
    if 'type' not in request.args:
        return jsonify({"error": "Field 'type' not defined."})
    if request.args['type'] == "categories":
        return jsonify(list(data.keys()))
    if "category" not in request.args:
        return jsonify({"error": "Field 'category' not defined."})
    category = request.args.get('category', "0")
    if category not in data:
        return jsonify({"error": "Invalid 'category' field."})
    category_data = data[category]
    if request.args['type'] == "all":
        return jsonify(category_data.items)
    elif request.args['type'] == "list":
        return jsonify(list(category_data.items.keys()))
    elif request.args['type'] == "recommended":
        return jsonify(list(category_data.items.keys())[:10])
    elif request.args['type'] == "query":
        asins = request.args.get('asin', '0').split(',')
        output = []
        for asin in asins:
            if asin in category_data.items:
                item_obj = category_data.items[asin]
                output.append(item_obj)
        return jsonify(output)
    return jsonify({})


@app.route('/reviews/')
def reviews_cb():
    if "category" not in request.args:
        return jsonify({"error": "Field 'category' not defined."})
    category = request.args.get('category', "0")
    if category not in data:
        return jsonify({"error": "Invalid 'category' field."})
    category_data = data[category]
    if 'asin' not in request.args:
        return jsonify({"error": "Field 'asin' not defined."})
    asin = request.args.get('asin', '0')
    rate = request.args.get('rate', -1.0, type=float)

    output = []
    for review in category_data.reviews:
        if review['asin'] == asin:
            if rate == -1.0 or review['overall'] == rate:
                output.append(review)
    return jsonify(output)


if __name__ == '__main__':
    app.run()
