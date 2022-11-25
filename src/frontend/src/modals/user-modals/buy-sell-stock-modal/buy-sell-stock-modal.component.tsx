import React from "react";

// styles
import styles from "./buy-sell-stock-modal.module.scss";

// templates
import TemplateActionModal from "../../action-modal/action-modal.template";

// hooks
import useBuySellStockModal from "./buy-sell-stock-modal.hook";

// interfaces
import { IBuySellStockData } from "./buy-sell-stock-modal.types";
interface IBuySellStockModal {
  isBuyModal: boolean;
  isOpened: boolean;
  handleCancelClick: () => void;
  data: IBuySellStockData | null;
}

const BuySellStockModal: React.FC<IBuySellStockModal> = ({
  isBuyModal,
  isOpened,
  handleCancelClick,
  data
 }) => {
  const {
    isLoading,
    handleSubmitClick
  } = useBuySellStockModal(isBuyModal);
  
  return (
    <TemplateActionModal
      isOpened={isOpened}
      isLoading={isLoading}
      title={`Złóż ofertę ${isBuyModal ? "kupna" : "sprzedaży"} akcji`}
      submitButtonTitle="Złóż ofertę"
      cancelButtonTitle="Zamknij"
      onSubmitClick={handleSubmitClick}
      onCancelClick={handleCancelClick}
    >
      <div className={styles.contentContainer}>
        {/*TODO - write body of the modal (with styling)*/}
        {data?.id}
      </div>
    </TemplateActionModal>
  );
};

export default BuySellStockModal;