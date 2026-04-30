import { type Institution } from "../../types/institution";
import { useEnterQueueState } from "../../hooks/useEnterQueueState";
import EnterQueueLayout from "./queuenumber/Enterqueuelayout";
import Toast from "../common/Toast";

interface EnterQueueNumberProps {
  institution: Institution;
  onSubmit: (queueNumber: number) => void;
  onBack?: () => void;
  joining?: boolean;
  joinError?: string | null;
}

export default function EnterQueueNumber({
  institution,
  onSubmit,
  joining = false,
  joinError = null,
}: EnterQueueNumberProps) {
  const {
    institution: liveInstitution,
    showSkeleton,
    queueNumberInput,
    setQueueNumberInput,
    inputError,
    setInputError,
    isValid,
    spotsAway,
    estWait,
    handleSubmit,
    toasts,
    removeToast,
  } = useEnterQueueState({ institution, onSubmit, joinError });

  return (
    <div>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          variant={t.variant}
          onClose={() => removeToast(t.id)}
        />
      ))}

      <EnterQueueLayout
        institution={liveInstitution}
        showSkeleton={showSkeleton}
        queueNumberInput={queueNumberInput}
        setQueueNumberInput={setQueueNumberInput}
        inputError={inputError}
        setInputError={setInputError}
        isValid={isValid}
        spotsAway={spotsAway}
        estWait={estWait}
        joining={joining}
        onSubmit={handleSubmit}
      />
    </div>
  );
}