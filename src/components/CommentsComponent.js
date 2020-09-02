import React, { Component } from 'react';

import { Control, Form, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { Stagger, Fade } from 'react-animation-components';
import {
	Card,
	CardBody,
	CardHeader,
	Button,
	Row,
	Col,
	Collapse,
	Carousel,
	CarouselItem,
	CarouselIndicators,
	CarouselControl
} from 'reactstrap';
import './customstyles.css';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
const validEmail = (val) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
const validName = (len1, len2) => (val) => minLength(len1)(val) && maxLength(len2)(val);

class CommentComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isCommentFormOpen: true,
			animating: false,
			activeIndex: 0,
			toastShow: false
		}
		this.renderCommentsCarousel = this.renderCommentsCarousel.bind(this);
		this.toggleComment = this.toggleComment.bind(this);
		this.handleComment = this.handleComment.bind(this);
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.setActiveIndex = this.setActiveIndex.bind(this);
		this.setAnimating = this.setAnimating.bind(this);
		this.toggleToastShow = this.toggleToastShow.bind(this);
	}

	toggleComment() {
		this.setState({
			isCommentFormOpen: !this.state.isCommentFormOpen
		});
	}
	toggleToastShow() {
		this.setState({
			toastShow: !this.state.toastShow
		});
	}
	setActiveIndex(index) {
		this.setState({
			activeIndex: index
		});
	}
	setAnimating(val) {
		this.setState({
			animating: val
		});
	}
	next() {
		if (this.state.animating) return;
		const nextIndex = this.state.activeIndex === this.props.comments.length - 1 ? 0 : this.state.activeIndex + 1;
		this.setActiveIndex(nextIndex);

	}
	previous() {
		if (this.state.animating) return;
		const nextIndex = this.state.activeIndex === 0 ? this.props.comments.length - 1 : this.state.activeIndex - 1;
		this.setActiveIndex(nextIndex);
	}

	handleComment(values) {

		this.props.postComment(values);
		this.props.resetFeedbackForm();
		//addComment(this.props.dish.id,values.rating,values.author,values.message)
		//event.preventDefault();//by default control goes to next page
	}


	renderCommentsCarousel({ comments }) {

		const slides = comments.map((comment) => {
			return (
				<CarouselItem inverse
					onExiting={() => this.setAnimating(true)}
					onExited={() => this.setAnimating(false)}
					key={comment.id}
				>
					<div>
						<Collapse isOpen={!this.state.toastShow}>
							<Card className="roundedBottomCorners roundedTopCorners" inverse color="dark">
								<CardBody>

									<h4><strong>{comment.message.slice(0, 20) + "..."}</strong></h4>
									<p> ~ {comment.author} </p>

								</CardBody>
							</Card>
						</Collapse>
					</div>
				</CarouselItem>
			);
		});
		const moreSlides = comments.map((comment) => {
			return (
				<li>
					<div>
						<Fade in>
							<CardBody className="cardComment">
								<p className="align text-left nex"><strong>{"\"" + comment.message + "\""}</strong></p>
								<p className="align text-right ex"><i> ~ {comment.author} {" ,  "}{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</i></p>
							</CardBody>
						</Fade>
					</div>
				</li>
			);
		})
		const showMoreOrLess = (more) => {
			if (more) return (<div>show less{"  "}<span className="fa fa-angle-up fa-lg"></span></div>)
			return (<div>show more{" ("+(this.props.comments.length-1)+" comments)  "}<span className="fa fa-angle-down fa-lg"></span></div>);
		};
		return (
			<div>
				<Carousel inverse color="dark" activeIndex={this.state.activeIndex}
					next={this.next}
					previous={this.previous}
				>

					<CarouselIndicators text-color="dark" items={comments} activeIndex={this.state.activeIndex} onClickHandler={this.setActiveIndex} />
					{slides}
					<CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
					<CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />

				</Carousel>
				<a onClick={this.toggleToastShow}>{showMoreOrLess(this.state.toastShow)}</a>
				<div>

					<Collapse isOpen={this.state.toastShow}>
						<ul className="list-unstyled">
							<Stagger in>
								{moreSlides}
							</Stagger>
						</ul>
					</Collapse>
				</div>
			</div>

		);

	}
	render() {
		if (this.props.isLoading) {
			return (
				<div className='container'>
					<div className="row">
						<Loading />
					</div>
				</div>
			);
		} else if (this.props.errMess) {
			return (
				<div className='container'>
					<div className="row">
						<h4>{this.props.errMess}</h4>
					</div>
				</div>
			);
		} else if (this.props.comments != null) {
			const textonbutton = (commentOpen) => {
				if (commentOpen === false)
					return (<div><strong>{"Show Comments "}<i className="fa fa-lg fa-angle-down"></i></strong></div>);
				return (<div><strong>{"Hide Comments "}<i className="fa fa-lg fa-angle-up"></i></strong></div>);
			};
			const Commentsform = () => {
				return (
					<Card className="roundedTopCorners">
						<CardHeader className="darkCardHeader bg-dark" tag="h3">
							<strong>Leave us a comment!</strong><textonbutton />
						</CardHeader>
						<CardBody>
							<Form model="feedback" onSubmit={(values) => this.handleComment(values)}>
								<Row className="form-group">

									<Col xs={{ size: 10, offset: 1 }}>
										<Control.text className="form-control" model=".author" id="author" name="author" placeholder="Name" validators={{ required, validName: validName(3, 15) }} />
										<Errors className="text-danger text-center" model=".author" show="touched" messages={{
											required: " required ! .. ",
											validName: " Please enter a valid name(3-20 characters) "
										}} />
									</Col>
								</Row>
								<Row className="form-group">
									<Col xs={{ size: 10, offset: 1 }}>
										<Control.text className="form-control" model=".email" id="email" name="email" placeholder="Email ID" validators={{ required, validEmail }} />
										<Errors className="text-danger text-center" model=".email" show="touched" messages={{
											required: "required ! ..",
											validEmail: " Please enter a valid email "
										}} />
									</Col>
								</Row>
								<Row className="form-group">

									<Col xs={{ size: 10, offset: 1 }}>
										<Control.textarea className="form-control" model=".message" id="message" name="message" placeholder="Tell us about your opinion" rows={5} validators={{ validName: validName(2, 500) }} />
										<Errors className="text-danger text-center" model=".message" show="touched" messages={{
											required: " required ! .. ",
											validName: " Write something before you submit "
										}} />
									</Col>
								</Row>
								<Row className="form-group">
									<Col md={{ size: 10, offset: 1 }}>
										<Button type="submit" color="dark">
											<span className="fa fa-pencil "> </span>
											{" "}Submit
			                        </Button>
									</Col>
								</Row>
							</Form>
						</CardBody>
					</Card>
				);
			};

			return (
				<div className="container ">
					<br />
					<div className="row justify-content-center ">
						<div className="col-12 col-md-8 col-lg-5 " styles={{ "margin-bottom": "0" }}>
							{Commentsform()}
						</div>
					</div>
					<div className="row justify-content-center">
						<div className=" col-12 col-md-8 col-lg-5 " styles={{ "margin-top": "0" }} >
							<Card className="roundedBottomCorners">
								<CardBody>
									<a
										onClick={this.toggleComment}>
										{textonbutton(this.state.isCommentFormOpen)}
									</a>

									<Collapse isOpen={this.state.isCommentFormOpen}>
										<br />{this.renderCommentsCarousel({ comments: this.props.comments })}

									</Collapse>
								</CardBody>
							</Card>
						</div>
					</div>


				</div>

			);
		}
	}
}
export default CommentComponent;


// <Modal isOpen={this.isCommentFormOpe} toggle={this.toggleComment}>
// 			            <ModalHeader toggle={this.toggleComment}>
// 			                Kindly leave your thoughts below
// 			            </ModalHeader>
// 			            <ModalBody>
// 			                <LocalForm onSubmit={(values)=>this.handleComment(values)}>
// 			                    <Row className="form-group">
// 			                        <Label htmlFor="author" md={2}>Name</Label>
// 			                        <Col md={10}>
// 			                        <Control.text className="form-control" model=".author" id="author" name="author" placeholder="Name" validators={{required,validName:validName(3,15)}} />
// 			                        <Errors className="alert-danger text-center" model=".author" show="touched" messages={{
// 											required:" required ! .. ",
// 											validName:" Please enter a valid name(3-20 characters) "
// 										}} />
// 			                        </Col>
// 			                    </Row>
// 			                    <Row className="form-group">
// 			                        <Label htmlFor="email" md={2}>Email</Label>
// 			                        <Col md={10}>
// 			                        <Control.text className="form-control" model=".email" id="email" name="email" placeholder="Email ID" validators={{required,validEmail}} />
// 			                        <Errors className="alert-danger text-center" model=".email" show="touched" messages={{
// 											required:"required ! ..",
// 											validEmail:" Please enter a valid email "
// 										}} />
// 			                        </Col>
// 			                    </Row>
// 			                    <Row className="form-group">
// 			                        <Label htmlFor="message" md={2}>Comment</Label>
// 			                        <Col md={10}>
// 			                        <Control.textarea className="form-control" model=".message" id="message" name="message" placeholder="Tell us about your opinion" rows={12} validators={{validName:validName(2,500)}} />
// 			                        <Errors className="alert-danger text-center" model=".message" show="touched" messages={{
// 											required:" required ! .. ",
// 											validName:" Write something before you submit "
// 										}} />
// 			                        </Col>
// 			                    </Row>
// 			                    <Row className="form-group">
// 			                        <Col md={{size:10,offset:2}}>
// 			                        <Button type="submit" color="primary">
// 			                            <span className="fa fa-pencil "> </span>
// 			                            {" "}Submit 
// 			                        </Button>
// 			                        </Col>
// 			                    </Row>
// 			                </LocalForm>
// 			            </ModalBody>
// 			        </Modal>