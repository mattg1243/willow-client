import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";
import { Header } from "../../../components/Header";
import { useUser } from "@/lib/auth";
import { paths } from "@/config/paths";

export function LandingRoute() {
  const navigate = useNavigate();
  const user = useUser();

  const handleGetStarted = () => {
    if (!user) {
      console.log("no user");
      navigate(paths.app.dashboard.getHref());
    } else {
      navigate(paths.auth.register.getHref());
    }
  };

  return (
    <div className={styles.cont}>
      <Header user={user?.user} />
      <div className={styles.section1}>
        <h1>With us, billing is easy</h1>
        <h3>
          Willow handles your business so you can focus on what you do best
        </h3>
        <Button bg="error.100" onClick={handleGetStarted}>
          Try today for free
        </Button>
      </div>
    </div>
  );
}
