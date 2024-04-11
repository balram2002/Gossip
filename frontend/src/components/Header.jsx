import { Box, Button, Divider, Flex, Image, Link, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Box rounded={"lg"} boxShadow={"lg"}>
			<Flex justifyContent={"space-between"} mt={3} mb='2' >
				{user && (
					<Link as={RouterLink} to='/' mt={1.5}>
						<AiFillHome size={24} />
					</Link>
				)}
				{!user && (
					<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
						Login
					</Link>
				)}

				<Flex gap={0.5}>
					<Text marginTop={1} fontWeight={"500"}>
						Gos
					</Text>

					<Image
						cursor={"pointer"}
						alt='logo'
						w={9}
						src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
						onClick={toggleColorMode}
					/>

					<Text marginTop={1} fontWeight={"500"}>
						sip
					</Text>
				</Flex>

				{user && (
					<Flex alignItems={"center"} gap={4}>
						<Text as={RouterLink} to={`/${user.username}`} marginBottom={"3px"}>
							{user.name}
						</Text>
						<Link as={RouterLink} to={`/${user.username}`}>
							<RxAvatar size={24} />
						</Link>
						<Link as={RouterLink} to={`/chat`}>
							<BsFillChatQuoteFill size={20} />
						</Link>
						<Link as={RouterLink} to={`/settings`}>
							<MdOutlineSettings size={20} />
						</Link>
						<Button size={"xs"} onClick={logout}>
							<FiLogOut size={20} />
						</Button>
					</Flex>
				)}

				{!user && (
					<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
						Sign up
					</Link>
				)}
			</Flex>
			<Divider mb={5} />

		</Box>
	);
};

export default Header;
