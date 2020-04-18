import React from 'react';
import styles from './PackmanSpinner.module.css';

const PackmanSpinner = (props) => {
    return (
        <div className="w-full self-center text-center">
            <div className={styles['spinner-bean-eater']}>
                <div className={styles['bean']}>
                    <div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                    </div>
                    <div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackmanSpinner