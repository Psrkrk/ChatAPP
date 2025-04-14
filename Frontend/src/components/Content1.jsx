import React from "react";

const Shape1 = () => (
	<svg
		width="335"
		height="186"
		viewBox="0 0 335 186"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M327.624 186C331.697 186 335 182.795 335 178.843C335 174.889 331.697 171.686 327.624 171.686L327.624 186ZM99.0264 108.432C99.0264 104.479 95.725 101.274 91.6506 101.274C87.5777 101.274 84.2748 104.479 84.2748 108.432L99.0264 108.432ZM14.7516 7.15719C14.7516 3.20498 11.4488 -1.41429e-05 7.37582 -1.43209e-05C3.30142 -1.4499e-05 -1.40095e-07 3.20498 -3.12851e-07 7.15719L14.7516 7.15719ZM70.8301 92.441C74.9031 92.441 78.206 89.2374 78.206 85.2838C78.206 81.3316 74.9031 78.1266 70.8301 78.1266L70.8301 92.441ZM327.624 171.686L237.363 171.686L237.363 186L327.624 186L327.624 171.686ZM237.363 171.686C227.292 171.686 219.034 163.687 219.034 153.695L204.283 153.695C204.283 171.481 219.031 186 237.363 186L237.363 171.686ZM219.034 153.695C219.034 135.907 204.272 121.392 185.942 121.392L185.942 135.706C196.019 135.706 204.283 143.708 204.283 153.695L219.034 153.695ZM185.942 121.392L180.609 121.392L180.609 135.706L185.942 135.706L185.942 121.392ZM180.609 121.392C162.28 121.392 147.517 135.907 147.517 153.695L162.268 153.695C162.268 143.708 170.534 135.706 180.609 135.706L180.609 121.392ZM147.517 153.695C147.517 163.684 139.253 171.686 129.177 171.686L129.177 186C147.506 186 162.268 171.485 162.268 153.695L147.517 153.695ZM129.177 171.686L123.272 171.686L123.272 186L129.177 186L129.177 171.686ZM123.272 171.686C109.935 171.686 99.0264 161.097 99.0264 147.921L84.2748 147.921C84.2748 168.9 101.682 186 123.272 186L123.272 171.686ZM99.0264 147.921L99.0264 131.902L84.2748 131.902L84.2748 147.921L99.0264 147.921ZM99.0264 131.902L99.0264 108.432L84.2748 108.432L84.2748 131.902L99.0264 131.902ZM-3.12851e-07 7.15719L-1.0331e-06 23.6345L14.7516 23.6345L14.7516 7.15719L-3.12851e-07 7.15719ZM-1.0331e-06 23.6345C-2.69384e-06 61.6278 31.7028 92.441 70.8301 92.441L70.8301 78.1266C39.8664 78.1266 14.7516 53.7377 14.7516 23.6345L-1.0331e-06 23.6345Z"
			fill="#4175DF"
			fillOpacity="0.17"
		/>
	</svg>
);

const Shape2 = () => (
	<svg
		width="102"
		height="102"
		viewBox="0 0 102 102"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M50.9999 102C79.1665 102 102 79.1665 102 51C102 22.8335 79.1665 0 50.9999 0C22.8334 0 0 22.8335 0 51C0 79.1665 22.8334 102 50.9999 102Z"
			fill="#FF9100"
			fillOpacity="0.19"
		/>
	</svg>
);

const Shape3 = () => (
	<svg
		width="291"
		height="168"
		viewBox="0 0 291 168"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M80.926 5.72087C38.4338 6.50518 4.64517 42.1258 5.44169 85.2796C6.23821 128.433 41.3183 162.781 83.8105 161.997L285.424 158.275"
			stroke="#34C69F"
			strokeWidth="10"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const Content1 = () => {
	return (
		<section
			className="py-24 md:py-36 bg-white text-zinc-900 relative overflow-hidden z-10"
			style={{
				backgroundImage:
					"url(https://cdn.easyfrontend.com/pictures/hero/hero31_bg.png)",
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center",
			}}
		>
			<div className="container px-4 mx-auto">
				<div className="absolute left-[5%] bottom-[11%] -z-10">
					<Shape1 />
				</div>
				<div className="absolute right-[5%] bottom-[11%] -z-10">
					<Shape2 />
				</div>

				<div className="grid grid-cols-12 gap-y-6 md:gap-x-6 max-w-7xl mx-auto text-center md:text-start">
					<div className="col-span-12 md:col-span-6 xl:col-span-5 flex flex-col justify-center">
						<h1 className="text-3xl font-bold leading-tight md:text-6xl mb-2">
                        Messaging That Feels Effortless
						</h1>
						<p className="text-xl leading-normal opacity-80 mb-12">
                        Connect instantly. Chat smoothly. Whether it's friends or customers — your conversations start here.
						</p>
						<div>
							
						</div>
					</div>
					<div className="col-span-12 md:col-span-5 md:col-start-8">
						<div className="relative">
							<img
								src="https://cdn.easyfrontend.com/pictures/users/user2.jpg"
								alt="user"
								className="w-full rounded-full object-cover mx-auto"
							/>
							<div className="absolute -left-[25%] bottom-[11%] -z-10">
								<Shape3 />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Content1;
