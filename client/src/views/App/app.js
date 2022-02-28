import React from 'react';
import {destinations, getData} from "../../util/request-sender";
import {Items} from "./items";

class ItemsContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="item-container">
            <h3>{this.props.title}</h3>
            <div className="items">{
                this.props.items.map((item, index)=>{
                    return <Items key={index} data={item} category={this.props.title} />
                })
            }</div>
        </div>
    }
}

class Showcase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { categories: {} };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.categories === prevProps.categories) return;
        this.getAllItemData().then(data=>this.setState({categories: data}));
    }

    async getAllItemData() {
        let output = {};
        for (let category of Object.keys(this.props.categories)){
            output[category] =  await getData(destinations.ZMZAON_ITEMS + "?type=query&category=" + category + "&asin=" + this.props.categories[category].join(","));
        }
        return output;
    }

    render() {
        return <div className="elastic-container">
            {
                Object.keys(this.state.categories).map((category, index)=>
                    <ItemsContainer key={index} title={category} items={this.state.categories[category]} />)
            }
        </div>;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { categories: {} };
        this.getRecommendedItems().then(data=>{
            this.setState({categories: data});
        });
    }

    async getRecommendedItems() {
        let categories = {};
        let categoryList = await getData(destinations.ZMZAON_ITEMS + "?type=categories");
        for (let category of categoryList)
            categories[category] = await getData(destinations.ZMZAON_ITEMS + "?type=recommended&category=" + category);
        return categories;
    }

    render() {
        return (
            <div className="root">
                <Showcase categories={this.state.categories} />
            </div>
        );
    }
}
export default (App);