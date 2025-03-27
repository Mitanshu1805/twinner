import { Button } from 'react-bootstrap';

// types
import { Variant } from './types';

type SoftButtonProps = {
    variant: Variant;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
};

type ButtonVariant = Variant;

const SoftButton = ({ variant, children, onClick, className }: SoftButtonProps) => {
    return (
        <Button variant={`soft-${variant}`} className={`waves-effect waves-light ${className || ''}`} onClick={onClick}>
            {children}
        </Button>
    );
};

// const SoftButton = ({ variants, onClick, children }: SoftButtonProps) => {
//     const softButtonVariants: ButtonVariant[] = [...variants];

//     return (
//         <>
//             {/* <h4 className="header-title">Soft Buttons</h4>
//             <p className="sub-header">
//                 Use a classes <code>.btn-soft-**</code> to quickly create buttons with soft background.
//             </p> */}

//             <div className="button-list">
//                 {(softButtonVariants || []).map((item, index) => {
//                     return (
//                         <Button variant={'soft-' + item} className="waves-effect waves-light" key={index.toString()}>
//                             {item!.charAt(0).toUpperCase() + item!.slice(1)}
//                         </Button>
//                     );
//                 })}
//             </div>
//         </>
//     );
// };

export default SoftButton;
