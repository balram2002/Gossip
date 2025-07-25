import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { API_BASE_URL } from "../atoms/apiUrls";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	const user = useRecoilValue(userAtom);

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		try {
			const res = await fetch(API_BASE_URL + "/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({userId: user?._id}),
			});
			const data = await res.json();

			if (data.error) {
				return showToast("Error", data.error, "error");
			}
			if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	return (
		<>
			<Text my={1} fontWeight={"bold"}>
				Freeze Your Account
			</Text>
			<Text my={1}>You can unfreeze your account anytime by logging in.</Text>
			<Button size={"sm"} colorScheme='red' onClick={freezeAccount}>
				Freeze
			</Button>
		</>
	);
};
