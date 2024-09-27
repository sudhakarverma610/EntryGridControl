import { IconButton } from '@fluentui/react/lib/Button';
import { BackIcon, footerButtonStyles, footerStyles,ForwardIcon, PreviousIcon } from '../../styles/FooterStyles';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

 
export interface IGridFooterProps {
    currentPage:number;
    isLastPage:boolean,
     setCurrentPage: (page:number) => void
}

export const GridFooter = ({currentPage,isLastPage,setCurrentPage } : IGridFooterProps) => {
  const rows = useSelector((state: RootState) => state.grid.rows);

 

    const moveToFirst=()=>{
        setCurrentPage(1)
    }
   
    const movePrevious=()=>{
        setCurrentPage(currentPage-1)
    }
   
    const moveNext=()=>{
        setCurrentPage(currentPage+1)
    }
   
  return (
    <div className={footerStyles.content}>
      {/* <span></span> */}
      <div>
        {/* <IconButton
          styles={footerButtonStyles}
          iconProps={PreviousIcon}
          onClick={() => {
             moveToFirst();
          }}
          disabled={currentPage==1}
        />
        <IconButton
          styles={footerButtonStyles}
          iconProps={BackIcon}
          onClick={() => {
             movePrevious();
          }}
          disabled={currentPage==1}
        /> */}
        <span>Total Records {rows.length}</span>
        {/* <IconButton
          styles={footerButtonStyles}
          iconProps={ForwardIcon}
          onClick={() => {
             
            moveNext();
          }}
          disabled={isLastPage}
        /> */}
      </div>
    </div>
  );
};