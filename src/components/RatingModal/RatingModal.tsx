import { Dispatch, FC, SetStateAction } from "react";
import { BsStarFill } from "react-icons/bs";

interface Props {
    isOpen: boolean;
    ratingValue: number;
    setRatingValue: Dispatch<SetStateAction<number>>;
    ratingComment: string;
    setRatingComment: Dispatch<SetStateAction<string>>;
    reviewSubmitHandler: () => Promise<string | undefined>;
    isSubmittingReview: boolean;
    toggleRatingModal: () => void;
}

const RatingModal:FC<Props> = (props) => {
  
    const {
        isOpen,
        ratingValue,
        setRatingValue,
        setRatingComment,
        ratingComment,
        reviewSubmitHandler,
        isSubmittingReview,
        toggleRatingModal
    } = props;

    const startValues = [1, 2, 3, 4, 5];

    return (
        <div className={`fixed z-[61] inset-0 flex items-center justify-center ${
            isOpen
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
        }`}>
            <div className="bg-white w-96 p-5 rounded-lg shadow-lg">

                <h2 className="text-xl dark:text-gray-800 font-semibold mb-2">
                    Rate your experience
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>

                    {/* 5 stars */}
                    <div className="flex items-center">
                        {startValues.map(value => (
                            <button
                                onClick={() => setRatingValue(value)}
                                key={value}
                                className={`w-6 h-6 ${value <= ratingValue ? "text-yellow-500" : 'text-gray-300'}`}
                            >
                                <BsStarFill/>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    
                    <label className="block text-sm font-medium text-gray-700">
                        Your review
                    </label>

                    {/* Review text */}
                    <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        rows={4}
                        className="w-full px-2 py-3 border rounded-md"
                    />
                </div>

                <div className="flex justify-end">

                    {/* Submit review */}
                    <button
                        onClick={reviewSubmitHandler}
                        disabled={isSubmittingReview}
                        className="px-4 py-2 bg-primary text-white rounded-md"
                    >
                        {isSubmittingReview ? 'Submitting...' : 'Submit'}
                    </button>

                    {/* Exit Modal */}
                    <button
                        onClick={toggleRatingModal}
                        className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    )
}

export default RatingModal