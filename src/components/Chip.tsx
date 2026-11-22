import styles from './Chip.module.css';
interface IChip {
    text: string;
    status: 'Idle' | 'Running' | 'Success' | 'Partial' | 'Error'
}

const chipStatusValues = {
    Idle: {
        backgroundColor: 'var(--light-gray)',
        color: 'var(--dark-gray)'
    },
    Running: {
        backgroundColor: 'var(--light-blue)',
        color: 'var(--dark-blue)'
    },
    Success: {
        backgroundColor: 'var(--light-green)',
        color: 'var(--dark-green)'
    },
    Partial: {
        backgroundColor: 'var(--light-yellow)',
        color: 'var(--dark-yellow)'
    },
    Error: {
        backgroundColor: 'var(--light-red)',
        color: 'var(--dark-red)'
    }
}

export const Chip = ({ status, text }: IChip) => {
    console.log('status: ', status);
    console.log('chipStatusValues[status]: ', chipStatusValues[status]);

    const { backgroundColor, color } = status && chipStatusValues[status];
    return (
        <div className={styles['chip-wrapper']} style={{ backgroundColor, color }}>
            {text}
        </div>
    )
}