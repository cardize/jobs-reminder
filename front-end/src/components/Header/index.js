import '../../styles/styles.scss'
import logo from '../../assets/images/logo.svg'

const Header = () => {

    return (
        <div className="header-container">
            <img className="logo" src={logo} alt="Google Logo" />
            <h1>Jobs Reminder</h1>
        </div>)
}

export default Header