import useIsMobile from '../hooks/useIsMobile';
import SingleTabs from './tabs/SingleTabs';
import MultiTabs from './tabs/MultiTabs';

const Tabs = () => {
    let isMobile = useIsMobile();

    return (
        isMobile ? <SingleTabs /> : <MultiTabs />
    );
};

export default Tabs
