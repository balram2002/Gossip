import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { API_BASE_URL } from "../atoms/apiUrls";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`${API_BASE_URL}/api/posts/user/${username}`);
				const data = await res.json();
				console.log(data);
				setPosts(data);
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user && !loading) return <h1>User not found</h1>;

	return (
		<>
			<Box>

				<UserHeader user={user} postlength={posts?.length} />

				{fetchingPosts && (
					<Flex justifyContent={"center"} my={12}>
						<Spinner size={"xl"} />
					</Flex>
				)}
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.light")} marginY={1} boxShadow={"lg"} p={2} paddingRight={4}>

					{!fetchingPosts && posts.length === 0 && <Text textAlign={"center"} alignItems={"center"}>User has 0 posts, Create some Posts first.</Text>}
					{posts && posts?.map((post) => (
						<Post key={post._id} post={post} postedBy={post.postedBy} />
					))}
				</Box>
			</Box>
		</>
	);
};

export default UserPage;
