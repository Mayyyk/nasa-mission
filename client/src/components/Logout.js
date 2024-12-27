import { withStyles, withSounds } from 'arwes';
import Clickable from './Clickable';

const styles = () => ({
	logoutButton: {
		color: '#a1ecfb',
		cursor: 'pointer',
		marginLeft: '16px',
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
});

const Logout = (props) => {
	const { classes, sounds } = props;

	const handleLogout = async () => {
		try {
			const response = await fetch('https://localhost:5000/auth/logout', {
				credentials: 'include',
			});
			if (response.ok) {
				// Refresh the page to reset the application state
				window.location.reload();
			}
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	return (
		<Clickable>
			<span className={classes.logoutButton} onClick={handleLogout}>
				Logout
			</span>
		</Clickable>
	);
};

export default withSounds()(withStyles(styles)(Logout));
