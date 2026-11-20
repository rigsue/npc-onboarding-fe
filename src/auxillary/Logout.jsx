import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth/authSlice.js";
import { logoutUser } from "../services/authServices.js";


const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector(
        (state) => state.auth.token
    );

    const handleLogout = async () => {
        try {
            await logoutUser(token);
            dispatch(logout());
            navigate("/login");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default Logout;