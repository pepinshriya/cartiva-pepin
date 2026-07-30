import { Settings as SettingsIcon } from 'lucide-react';
import styles from './Settings.module.css';

const Settings = () => {
  return (
    <div>
      <h1 className={styles.title}>
        <SettingsIcon size={24} /> Settings
      </h1>
      <div className={styles.placeholder}>
        <p>Admin settings — store configuration, payment gateways, and user permissions.</p>
      </div>
    </div>
  );
};

export default Settings;
