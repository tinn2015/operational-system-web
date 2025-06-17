import { createStyles } from 'antd-style';

const useStyles = createStyles(({ }) => {
    return {
        mt20: {
            marginTop: '20px',
        },
        qrCodeBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            margin: '10px',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
        },
        previewBox: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            margin: '10px',
            padding: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',

            '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-2px)',
            },
        },
    };
});

export default useStyles; 