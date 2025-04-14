// import React from "react";
// import PropTypes from "prop-types";

// const testimonialList = [
// 	{
// 		author: {
// 			fullName: "Akshay Kumar",
// 			picture: "https://cdn.easyfrontend.com/pictures/users/user17.jpg",
// 			designation: "Founder / CEO",
// 		},
// 		rating: 3.5,
// 		description:
// 			"Two multiply fly them, made under a make replenish behold stars, is he of beast place also under unto it.",
// 	},
// 	{
// 		author: {
// 			fullName: "Raima Sen",
// 			picture: "https://cdn.easyfrontend.com/pictures/users/user8.jpg",
// 			designation: "Founder / CEO",
// 		},
// 		rating: 4,
// 		description:
// 			"Shall deep bearing divide seed moved replenish us, good our open he seed day which firmament creeping wherein fourth fly.",
// 	},
// 	{
// 		author: {
// 			fullName: "Arjun Kapur",
// 			picture: "https://cdn.easyfrontend.com/pictures/users/user18.jpg",
// 			designation: "Founder / CEO",
// 		},
// 		rating: 5,
// 		description:
// 			"It’s easier to reach your savings goals when you have the right savings account. Take a look and find the right one for you.",
// 	},
// ];

// const Rating = ({ rating }) => {
// 	const fullStars = Math.floor(rating);
// 	const hasHalfStar = rating % 1 !== 0;
// 	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

// 	return (
// 		<div className="mb-4 text-yellow-500 text-base">
// 			{[...Array(fullStars)].map((_, i) => (
// 				<span key={`full-${i}`}>★</span>
// 			))}
// 			{hasHalfStar && <span>★</span>}
// 			{[...Array(emptyStars)].map((_, i) => (
// 				<span key={`empty-${i}`} className="text-gray-300">
// 					☆ 
// 				</span>
// 			))}
// 		</div>
// 	);
// };

// Rating.propTypes = {
// 	rating: PropTypes.number.isRequired,
// };

// const TestimonialItem = ({ testimonial }) => (
// 	<div className="bg-white border border-gray-200 rounded-lg p-6 h-full transition-all duration-300">
// 		<img
// 			src={testimonial.author.picture}
// 			alt={testimonial.author.fullName}
// 			className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
// 		/>
// 		<h4 className="text-lg font-semibold mb-1">{testimonial.author.fullName}</h4>
// 		<p className="text-sm text-gray-500 mb-2">{testimonial.author.designation}</p>
// 		<Rating rating={testimonial.rating} />
// 		<p className="text-sm text-gray-700">{testimonial.description}</p>
// 	</div>
// );

// TestimonialItem.propTypes = {
// 	testimonial: PropTypes.object.isRequired,
// };

// const Testimonial5 = () => {
// 	return (
// 		<section className="py-14 md:py-20 bg-white text-gray-900">
// 			<div className="container px-4 mx-auto">
// 				<div className="text-center mb-12">
// 					<h2 className="text-3xl md:text-4xl font-bold mb-3">Community Reviews</h2>
// 					<p className="text-gray-600 max-w-xl mx-auto text-sm">
// 						Real thoughts from real users. Hear from our community.
// 					</p>
// 				</div>

// 				<div className="grid grid-cols-6 gap-6 text-center">
// 					{testimonialList.map((testimonial, i) => (
// 						<div className="col-span-6 sm:col-span-3 lg:col-span-2" key={i}>
// 							<TestimonialItem testimonial={testimonial} />
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</section>
// 	);
// };

// export default Testimonial5;
