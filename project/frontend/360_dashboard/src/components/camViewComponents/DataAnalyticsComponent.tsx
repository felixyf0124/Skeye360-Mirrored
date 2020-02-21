import React from 'react';
import { SKEYE_WHITE } from '../../css/custom';

const skeyeStyles = {
    Title: {
        color: SKEYE_WHITE,
        fontSize: 28,
        marginBottom: 4,
        fontWeight: 900,
    },
    Header: {
        color: SKEYE_WHITE,
        fontSize: 20,
        marginBottom: 4,
        fontWeight: 900,
    },
}

export default function DataAnalyticsComponent() {
    // eslint-disable-next-line consistent-return
    return (
        <div>
            <text style={ skeyeStyles.Title }>Data Analytics</text>
        </div>
    );
}

