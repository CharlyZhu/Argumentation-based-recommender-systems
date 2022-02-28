import React from "react";
import "../../style/items.scss";
import {destinations, getData} from "../../util/request-sender";

class Items extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props?.data;
        if (item)
            return <div className="item" onClick={()=>{document.location="./" + this.props.category + "/" + item.asin + "/"}}>
                <div className="img-container"> <img src={item.imageURLHighRes[0]} alt="item-img" /> </div>
                <h4 className="title">{item.brand}</h4>
                <div className="description">
                    {item.description.map((str, index)=><p key={index}>{str}</p>)}
                </div>
            </div>;
        else return <div className="item">Item not available...</div>
    }
}

class Comment extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="comment">
            <p><strong>{this.props.data.reviewerName}</strong> <small>Rating: {this.props.data.overall}</small></p>
            <p>{this.props.data.reviewText}</p>
            <p>{this.props.data.summary}</p>
        </div>
    }
}

class ItemPage extends React.Component {
    constructor(props) {
        super(props);
        let pathSeg = document.location.pathname.replace('/','').split('/');
        this.state = { asin: pathSeg[1].replace('/', ''), category: pathSeg[0] };
    }

    componentDidMount() {
        getData(destinations.ZMZAON_ITEMS + "?type=query&category=" + this.state.category + "&asin=" + this.state.asin)
            .then(data=>{
                let item = data[0];
                if (!item) document.location = "/";
                this.setState({item});
            });
        getData(destinations.ZMZAON_REVIEWS + "?category=" + this.state.category + "&asin=" + this.state.asin)
            .then(comments=>this.setState({comments}));
    }

    render() {
        let item = this.state.item;
        console.log(item);
        if (item)
            return <div className="item-page">
                <div className="elastic-container">
                    <span className="home-page-btn" onClick={()=>{document.location = "/"}}>← Back</span>
                </div>
                <div className="elastic-container">
                    <div className="img-container"> <img src={item.imageURLHighRes[0]} alt="item-img" /> </div>
                    <div className="details">
                        <h3 className="title">{item.brand}</h3>
                        <p><strong>ASIN:</strong> {item.asin}</p>
                        <p><strong>Category:</strong> {item.category.join(", ")}</p>
                        <p><strong>Main category:</strong> {item.main_cat}</p>
                        <p><strong>Rank:</strong> {item.rank}</p>
                        <div className="description">
                            <strong>Description:</strong><br />
                            {item.description.map((str, index)=><p key={index}>{str}</p>)}
                        </div>
                    </div>
                </div>
                <div className="elastic-container">
                    <div>
                        <p><strong>Leave a comment:</strong></p>
                        <textarea style={{width: "80vw", height: "200px"}} />
                        <button>SEND</button>
                    </div>
                </div>
                <div className="elastic-container column">
                    {this.state.comments ? this.state.comments.map((comment, index)=><Comment key={index} data={comment} />) : ""}
                </div>
            </div>;
        else return "";
    }
}

export { Items, ItemPage };