import { Appear, Paragraph, Button } from 'arwes';
import Clickable from '../components/Clickable';

const LoginPrompt = ({ entered }) => {
	const handleLogin = () => {
		// Redirect to your backend auth endpoint
		window.location.href = 'https://localhost:5000/auth/google';
	};

	return (
		<Appear id='login' animate show={entered}>
			<Paragraph>Please log in to schedule a mission launch.</Paragraph>
			<Clickable>
				<Button
					animate
					show={entered}
					type='button'
					layer='success'
					onClick={handleLogin}>
					Sign in with Google 🚀
				</Button>
			</Clickable>
		</Appear>
	);
};

export default LoginPrompt;
