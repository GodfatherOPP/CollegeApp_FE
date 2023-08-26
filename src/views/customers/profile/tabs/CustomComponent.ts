import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails'
import { styled } from '@mui/system'


export const Accordion = styled(MuiAccordion)<AccordionProps>(({ theme }) => ({
    margin: 0,
    borderRadius: 0,
    boxShadow: 'none !important',
    border:
        theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.divider}`,
    '&:not(:last-of-type), &:last-child .MuiAccordionSummary-root:not(.Mui-expanded)': {
        borderBottom: 0
    },
    '&:before': {
        display: 'none'
    },
    '&.Mui-expanded': {
        margin: 'auto'
    },
    '&:first-of-type': {
        '& .MuiButtonBase-root': {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderTopRightRadius: theme.shape.borderRadius
        }
    },
    '&:last-of-type': {
        '& .MuiAccordionSummary-root:not(.Mui-expanded)': {
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius
        }
    }
}))

// Styled component for AccordionSummary component
export const AccordionSummary = styled(MuiAccordionSummary)<AccordionSummaryProps>(({ theme }) => ({
    width: '100%',
    marginBottom: -1,
    padding: theme.spacing(0, 4),
    minHeight: theme.spacing(12),
    transition: 'min-height 0.15s ease-in-out',
    backgroundColor: theme.palette.action[theme.palette.mode === 'light' ? 'hover' : 'selected'],
    borderBottom:
        theme.palette.mode === 'light' ? `1px solid ${theme.palette.grey[300]}` : `1px solid ${theme.palette.divider}`,
    '&.Mui-expanded': {
        minHeight: theme.spacing(12)
    },
    '& .MuiAccordionSummary-content': {
        alignItems: 'center',
        '&.Mui-expanded': {
            margin: '12px 0'
        }
    },
    '& .MuiTypography-root': {
        fontWeight: 400
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: theme.palette.text.secondary
    }
}))

// Styled component for AccordionDetails component
export const AccordionDetails = styled(MuiAccordionDetails)<AccordionDetailsProps>(({ theme }) => ({
    padding: `${theme.spacing(4)} !important`
}))