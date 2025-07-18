import { Box, Divider, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../atoms/apiUrls";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [user, setUser] = useRecoilState(userAtom);
	const [post, setPost] = useState();
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();
	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
			try {
				const res = await fetch(API_BASE_URL + "/api/posts/feed", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user?._id ,
				}),
			});
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setPost(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};
		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<Box >
			<Flex gap='8' alignItems={"flex-start"}>
				<Box flex={70} rounded={"lg"} bg={useColorModeValue("white", "gray.light")} marginY={1} boxShadow={"lg"} p={2} paddingRight={4}>
					{!loading && posts?.length === 0 && <Text textAlign={"center"} alignItems={"center"}>Follow some users to see the feed</Text>}
					{!loading && post?.length >= 0 && <Text mb={4} textAlign={"center"} alignItems={"center"}> Posts Feed based on your following :</Text>}
					{!loading && post?.length >= 0 && <Divider mb={5} />}

					{loading && (
						<Flex justify='center'>
							<Spinner size='xl' />
						</Flex>
					)}

					{!loading && posts?.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</Box>
				<Box
					flex={30}
					display={{
						base: "none",
						md: "block",
					}}
				>
					<SuggestedUsers />
				</Box>
			</Flex>
		</Box>
	);
};

export default HomePage;
