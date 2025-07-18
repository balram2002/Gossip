import {
	Box,
	Button,
	Flex,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { API_BASE_URL } from "../atoms/apiUrls";
import { RWebShare } from 'react-web-share';

const Actions = ({ post, user: userpost }) => {
	const user = useRecoilValue(userAtom);
	const [showModal, setShowModal] = useState(false);
	const [liked, setLiked] = useState(post.likes.includes(user?._id));
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [isLiking, setIsLiking] = useState(false);
	const [isReplying, setIsReplying] = useState(false);
	const [reply, setReply] = useState("");

	const showToast = useShowToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleLikeAndUnlike = async () => {
		if (!user) return showToast("Error", "You must be logged in to like a post", "error");
		if (isLiking) return;
		setIsLiking(true);
		try {
			const res = await fetch(API_BASE_URL + "/api/posts/like/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: user?._id }),
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			if (!liked) {
				// add the id of the current user to post.likes array
				const updatedPosts = posts?.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: [...p.likes, user._id] };
					}
					return p;
				});
				setPosts(updatedPosts);
			} else {
				// remove the id of the current user from post.likes array
				const updatedPosts = posts?.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: p.likes.filter((id) => id !== user._id) };
					}
					return p;
				});
				setPosts(updatedPosts);
			}

			setLiked(!liked);
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsLiking(false);
		}
	};

	const handleReply = async () => {
		if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
		if (isReplying) return;
		setIsReplying(true);
		try {
			const res = await fetch(API_BASE_URL + "/api/posts/reply/" + post._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: reply,
					userId: user?._id,
					userProfilePic: user?.profilePic,
					username: user?.username,
				}),
			});
			const data = await res.json();
			if (data.error) return showToast("Error", data.error, "error");

			const updatedPosts = posts?.map((p) => {
				if (p._id === post._id) {
					return { ...p, replies: [...p.replies, data] };
				}
				return p;
			});
			setPosts(updatedPosts);
			showToast("Success", "Reply posted successfully", "success");
			onClose();
			setReply("");
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsReplying(false);
		}
	};

	return (
		<>
			<Flex flexDirection='column'>
				<Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
					<svg
						aria-label='Like'
						color={liked ? "rgb(237, 73, 86)" : ""}
						fill={liked ? "rgb(237, 73, 86)" : "transparent"}
						height='19'
						role='img'
						viewBox='0 0 24 22'
						width='20'
						cursor={"pointer"}
						onClick={handleLikeAndUnlike}
					>
						<path
							d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
							stroke='currentColor'
							strokeWidth='2'
						></path>
					</svg>

					<svg
						aria-label='Comment'
						color=''
						fill=''
						height='20'
						role='img'
						viewBox='0 0 24 24'
						width='20'
						cursor={"pointer"}
						onClick={onOpen}
					>
						<title>Comment</title>
						<path
							d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
							fill='none'
							stroke='currentColor'
							strokeLinejoin='round'
							strokeWidth='2'
						></path>
					</svg>

					<RWebShare
						data={{
							text: `Gossip shared Post.`,
							url: `${API_BASE_URL}/${user?.username}/post/${post._id}`,
							title: "Gossip Shared " + post?.text?.substr(0, 10) + "...",
						}}
					>
<svg
						aria-label='Share'
						color=''
						fill='rgb(243, 245, 247)'
						height='20'
						role='img'
						viewBox='0 0 24 24'
						width='20'
						cursor={"pointer"}
					>
						<title>Share</title>
						<line
							fill='none'
							stroke='currentColor'
							strokeLinejoin='round'
							strokeWidth='2'
							x1='22'
							x2='9.218'
							y1='3'
							y2='10.083'
						></line>
						<polygon
							fill='none'
							points='11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334'
							stroke='currentColor'
							strokeLinejoin='round'
							strokeWidth='2'
						></polygon>
					</svg>
					</RWebShare>
				</Flex>

				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"} fontSize='sm'>
						{post.replies.length} replies
					</Text>
					<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
					<Text color={"gray.light"} fontSize='sm'>
						{post.likes.length} likes
					</Text>
				</Flex>

				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Comment on {userpost?.name} post</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb={6}>
							<FormControl>
								<Input
									placeholder='Reply goes here..'
									value={reply}
									onChange={(e) => setReply(e.target.value)}
								/>
							</FormControl>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme='blue' size={"sm"} mr={3} isLoading={isReplying} onClick={handleReply}>
								Reply
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</Flex>
		</>
	);
};

export default Actions;

