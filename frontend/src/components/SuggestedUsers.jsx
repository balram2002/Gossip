import { Box, Divider, Flex, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import { API_BASE_URL } from "../atoms/apiUrls";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const SuggestedUsers = () => {
	const [loading, setLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const showToast = useShowToast();
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch(API_BASE_URL + "/api/users/suggested", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: user?._id,
				}),
			});
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setSuggestedUsers(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, [showToast]);

	return (
		<>
			<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={4}>
				<Text mb={3} fontWeight={"bold"}>
					Suggested Users
				</Text>
				<Divider mb={3} />

				<Flex direction={"column"} gap={4}>
					{!loading && suggestedUsers?.map((user) => <SuggestedUser key={user._id} user={user} />)}
					{loading &&
						[0, 1, 2, 3, 4]?.map((_, idx) => (
							<Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
								{/* avatar skeleton */}
								<Box>
									<SkeletonCircle size={"10"} />
								</Box>
								{/* username and fullname skeleton */}
								<Flex w={"full"} flexDirection={"column"} gap={2}>
									<Skeleton h={"8px"} w={"80px"} />
									<Skeleton h={"8px"} w={"90px"} />
								</Flex>
								{/* follow button skeleton */}
								<Flex>
									<Skeleton h={"20px"} w={"60px"} />
								</Flex>
							</Flex>
						))}
				</Flex>
			</Box>
		</>
	);
};

export default SuggestedUsers;

