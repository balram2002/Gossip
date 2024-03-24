import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";
import { Box } from "@chakra-ui/react";

const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);

	return <>
		<Box>
			{authScreenState === "login" ? <LoginCard /> : <SignupCard />}
		</Box>
	</>;
};

export default AuthPage;
