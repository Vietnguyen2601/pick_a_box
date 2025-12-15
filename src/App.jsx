import React, { useState, useEffect } from "react";
import "./App.css";

// Tạo hàm để phát âm thanh
const playSound = (type) => {
  // Sử dụng Web Audio API để tạo âm thanh
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  switch (type) {
    case "flip": // Âm thanh lật ô
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case "correct": // Âm thanh trả lời đúng
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case "wrong": // Âm thanh trả lời sai
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case "bomb": // Âm thanh ném bom
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;
    default:
      break;
  }
};

const questions = [
  {
    question:
      "Theo nội dung văn bản, mục đích chính của việc các doanh nghiệp lớn liên minh lại thành tổ chức độc quyền là gì?",
    options: [
      "A. Tăng cường sự cạnh tranh tự do trên thị trường.",
      "B. Chia sẻ công nghệ miễn phí cho các doanh nghiệp nhỏ.",
      "C. Có khả năng định ra giá cả độc quyền nhằm thu lợi nhuận độc quyền cao.",
      "D. Xóa bỏ hoàn toàn vai trò của nhà nước trong kinh tế.",
    ],
    answer: "C",
  },
  {
    question:
      "Đâu là nguyên nhân cơ bản dẫn đến sự hình thành các tổ chức độc quyền từ góc độ lực lượng sản xuất?",
    options: [
      "A. Sự phát triển của lực lượng sản xuất thúc đẩy quá trình tích tụ và tập trung sản xuất.",
      "B. Nhu cầu tiêu dùng của người dân giảm sút mạnh.",
      "C. Sự can thiệp hành chính của nhà nước ngăn cản sản xuất.",
      "D. Các doanh nghiệp nhỏ từ chối hợp tác với nhau.",
    ],
    answer: "A",
  },
  {
    question: 'Đâu là định nghĩa đúng về "Độc quyền nhà nước"?',
    options: [
      "A. Là sự xóa bỏ hoàn toàn khu vực kinh tế tư nhân để nhà nước làm chủ.",
      "B. Là kiểu độc quyền trong đó nhà nước nắm giữ vị thế độc quyền dựa trên sức mạnh của các tổ chức độc quyền.",
      "C. Là việc nhà nước chỉ quản lý các doanh nghiệp nhỏ và vừa.",
      "D. Là sự độc quyền chỉ diễn ra trong lĩnh vực an ninh và quốc phòng.",
    ],
    answer: "B",
  },
  {
    question:
      "Vì sao sự phân công lao động xã hội phát triển lại dẫn đến sự hình thành độc quyền nhà nước ở những ngành mới?",
    options: [
      "A. Vì những ngành này cần vốn đầu tư lớn, thu hồi vốn chậm và ít lợi nhuận nên tư nhân không muốn làm.",
      "B. Vì những ngành này mang lại lợi nhuận siêu ngạch ngay lập tức.",
      "C. Vì tư nhân bị cấm hoàn toàn không được tham gia vào các ngành công nghiệp mới.",
      "D. Vì các ngành này không đòi hỏi kỹ thuật cao.",
    ],
    answer: "A",
  },
  {
    question: "Bản chất của chủ nghĩa tư bản độc quyền nhà nước là gì?",
    options: [
      "A. Là một chính sách ngắn hạn để vượt qua khủng hoảng kinh tế.",
      "B. Là sự kết hợp sức mạnh của các tổ chức độc quyền tư nhân và sức mạnh của nhà nước tư bản.",
      "C. Là sự chuyển đổi hoàn toàn sang chế độ xã hội chủ nghĩa.",
      "D. Là sự triệt tiêu tính cạnh tranh trong nội bộ nền kinh tế tư bản.",
    ],
    answer: "B",
  },
  {
    question:
      "Đâu là một trong những tác động tích cực của độc quyền đối với nền kinh tế?",
    options: [
      "A. Làm giảm khoảng cách giàu nghèo trong xã hội.",
      "B. Tạo ra khả năng cho nghiên cứu và triển khai các tiến bộ khoa học kỹ thuật.",
      "C. Luôn luôn giảm giá thành sản phẩm cho người tiêu dùng cuối cùng.",
      "D. Loại bỏ hoàn toàn nguy cơ khủng hoảng thừa.",
    ],
    answer: "B",
  },
  {
    question: "Tác động tiêu cực của độc quyền thể hiện ở điểm nào sau đây?",
    options: [
      "A. Tăng năng suất lao động xã hội.",
      "B. Thúc đẩy nền kinh tế phát triển theo hướng hiện đại.",
      "C. Có thể kìm hãm sự tiến bộ kỹ thuật và sự phát triển kinh tế, xã hội.",
      "D. Giảm bớt sự phân hóa giàu nghèo trong dân cư.",
    ],
    answer: "C",
  },
  {
    question:
      "Trong trạng thái độc quyền, quan hệ cạnh tranh nào sau đây vẫn tồn tại?",
    options: [
      "A. Chỉ còn cạnh tranh giữa các tổ chức độc quyền với nhau.",
      "B. Cạnh tranh giữa tổ chức độc quyền và xí nghiệp ngoài độc quyền.",
      "C. Không còn bất kỳ hình thức cạnh tranh nào.",
      "D. Chỉ còn cạnh tranh giữa người tiêu dùng và nhà nước.",
    ],
    answer: "B",
  },
  {
    question:
      "Theo quy luật từ cạnh tranh tự do đến độc quyền áp dụng vào trường hợp của Apple, điều gì xảy ra với các doanh nghiệp yếu thế?",
    options: [
      "A. Được các doanh nghiệp lớn hỗ trợ vốn để cùng phát triển.",
      "B. Trở thành đối tác ngang hàng với các doanh nghiệp lớn.",
      "C. Bị thua lỗ, phá sản hoặc bị thâu tóm (Cá lớn nuốt cá bé).",
      "D. Được nhà nước bảo hộ hoàn toàn để không bị phá sản.",
    ],
    answer: "C",
  },
  {
    question:
      'Dựa trên bài toán "Giá cả độc quyền" của Apple, lợi nhuận độc quyền khổng lồ được tạo ra từ đâu?',
    options: [
      "A. Chênh lệch giữa Giá cả độc quyền cao (đầu ra) và Giá cả độc quyền thấp (đầu vào).",
      "B. Sự hỗ trợ vốn không hoàn lại từ chính phủ Mỹ.",
      "C. Việc bán sản phẩm với giá thấp hơn chi phí sản xuất để chiếm lĩnh thị trường.",
      "D. Việc trả lương rất cao cho tất cả các nhà cung cấp và lập trình viên.",
    ],
    answer: "A",
  },
];

const boxTypes = [
  // 10 ô điểm (tương ứng 10 câu hỏi)
  { type: "point", value: 100 },
  { type: "point", value: 200 },
  { type: "point", value: 500 },
  { type: "point", value: 100 },
  { type: "point", value: 200 },
  { type: "point", value: 500 },
  { type: "point", value: 100 },
  { type: "point", value: 200 },
  { type: "point", value: 200 },
  { type: "point", value: 100 },
  // 3 ô trừ điểm
  { type: "minus", value: 100 },
  { type: "minus", value: 200 },
  { type: "minus", value: 300 },
  // 2 ô ném bom
  { type: "bomb", value: 150 },
  { type: "bomb", value: 150 },
];

function App() {
  const [boxes, setBoxes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [boxResult, setBoxResult] = useState({}); // Lưu trạng thái đúng/sai của mỗi ô

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffledBoxes = [...boxTypes].sort(() => Math.random() - 0.5);
    const boxesWithQuestions = shuffledBoxes.map((box, index) => {
      // Chỉ gán câu hỏi cho các ô điểm, không gán cho hiệu ứng
      return {
        ...box,
        id: index,
        question:
          box.type === "point" ? questions[index % questions.length] : null,
        opened: false,
      };
    });
    setBoxes(boxesWithQuestions);
    setScore(0);
    setGameOver(false);
    setCurrentQuestion(null);
    setSelectedBox(null);
    setShowAnswer(false);
    setAnswerResult(null);
  };

  const selectBox = (box) => {
    if (box.opened) return;
    setSelectedBox(box);
    playSound("flip"); // Phát âm thanh lật ô

    // Nếu là ô hiệu ứng, áp dụng tức thì
    if (box.type !== "point") {
      applyEffect(box);
    } else {
      // Nếu là ô điểm, hiển thị câu hỏi
      setCurrentQuestion(box.question);
    }
  };

  const applyEffect = (box) => {
    if (box.type === "minus") {
      setScore((prev) => Math.max(0, prev - box.value));
      playSound("wrong"); // Âm thanh khi trừ điểm
    } else if (box.type === "bomb") {
      setScore((prev) => Math.max(0, prev - box.value));
      playSound("bomb"); // Âm thanh ném bom
    }

    // Đóng hộp ngay lập tức
    setBoxes((prev) =>
      prev.map((b) => (b.id === box.id ? { ...b, opened: true } : b))
    );
    setSelectedBox(null);

    // Kiểm tra game over
    setTimeout(() => {
      if (boxes.filter((b) => !b.opened).length === 1) {
        setGameOver(true);
      }
    }, 100);
  };

  const submitAnswer = (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.answer;
    setAnswerResult(isCorrect);
    setShowAnswer(true);

    // Phát âm thanh tùy theo đúng hay sai
    playSound(isCorrect ? "correct" : "wrong");

    setTimeout(() => {
      if (isCorrect && selectedBox.type === "point") {
        setScore((prev) => prev + selectedBox.value);
        // Lưu trạng thái đúng cho ô
        setBoxResult((prev) => ({ ...prev, [selectedBox.id]: "correct" }));
      } else if (!isCorrect && selectedBox.type === "point") {
        // Lưu trạng thái sai cho ô
        setBoxResult((prev) => ({ ...prev, [selectedBox.id]: "wrong" }));
      }
      // Đóng hộp
      setBoxes((prev) =>
        prev.map((b) => (b.id === selectedBox.id ? { ...b, opened: true } : b))
      );
      setCurrentQuestion(null);
      setSelectedBox(null);
      setShowAnswer(false);
      setAnswerResult(null);

      // Kiểm tra game over nếu tất cả hộp đã mở
      if (boxes.filter((b) => !b.opened).length === 1) {
        setGameOver(true);
      }
    }, 2000);
  };

  return (
    <div className="app">
      <h1>🎄 Pick-a-Box Game 🎄</h1>
      <div className="boxes">
        {boxes.map((box) => (
          <div
            key={box.id}
            className={`box ${box.opened ? "opened" : ""} ${
              selectedBox && selectedBox.id === box.id ? "selected" : ""
            } ${boxResult[box.id] === "correct" ? "correct-box" : ""} ${
              boxResult[box.id] === "wrong" ? "wrong-box" : ""
            }`}
            onClick={() => selectBox(box)}
          >
            {box.opened
              ? box.type === "point"
                ? box.value
                : box.type === "minus"
                ? `−${box.value}`
                : `💣${box.value}`
              : "?"}
          </div>
        ))}
      </div>
      {currentQuestion && !showAnswer && (
        <div className="question">
          <h2>{currentQuestion.question}</h2>
          <div className="options">
            {currentQuestion.options.map((option) => (
              <button key={option[0]} onClick={() => submitAnswer(option[0])}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {showAnswer && (
        <div className="answer-result">
          {answerResult ? "Đúng! 🎉" : "Sai rồi! 😞"}
        </div>
      )}
      <button onClick={initializeGame} className="reset">
        Chơi lại
      </button>
    </div>
  );
}

export default App;
