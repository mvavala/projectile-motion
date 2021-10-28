import { useState } from 'react';
import { render } from 'sass';
import ProjectileMotion from './components/projectileMotion/projectileMotion';
import SpaceDodger from './components/spaceDodger/spaceDodger';

function App() {
    const [renderGame, setRenderGame] = useState(false);

    return (
        <div className='App'>
            {!renderGame ? (
                <ProjectileMotion setRenderGame={setRenderGame} />
            ) : (
                <SpaceDodger />
            )}
        </div>
    );
}

export default App;
