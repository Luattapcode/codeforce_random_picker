// Danh sách các tag phổ biến trên Codeforces
const COMMON_TAGS = [
    "implementation", "dp", "math", "greedy", "data structures",
    "brute force", "constructive algorithms", "graphs", "sortings",
    "binary search", "dfs and similar", "trees", "strings",
    "number theory", "combinatorics", "two pointers", "bitmasks",
    "geometry", "probabilities", "dsu", "shortest paths", "matrices"
];

let allProblems = [];
let selectedTags = new Set();

// Khởi tạo giao diện tag
function initTags() {
    const container = document.getElementById('tagContainer');
    COMMON_TAGS.forEach(tag => {
        const chip = document.createElement('div');
        chip.className = 'tag-chip';
        chip.textContent = tag;
        chip.addEventListener('click', () => {
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
                chip.classList.remove('active');
            } else {
                selectedTags.add(tag);
                chip.classList.add('active');
            }
            updateSelectedCount();
        });
        container.appendChild(chip);
    });
}

function updateSelectedCount() {
    const countEl = document.getElementById('selectedCount');
    countEl.textContent = `${selectedTags.size} đã chọn`;
}

// Tải danh sách bài toán từ Codeforces API
async function fetchProblems() {
    try {
        const response = await fetch('https://codeforces.com/api/problemset.problems');
        const data = await response.json();
        if (data.status === 'OK') {
            allProblems = data.result.problems;
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách bài từ Codeforces:", error);
        alert("Không thể kết nối tới Codeforces API. Vui lòng kiểm tra lại mạng!");
    }
}

// Xử lý random bài
function handleRandom() {
    if (allProblems.length === 0) {
        alert("Đang tải dữ liệu từ Codeforces, vui lòng đợi giây lát...");
        return;
    }

    const minRating = parseInt(document.getElementById('minRating').value) || 0;
    const maxRating = parseInt(document.getElementById('maxRating').value) || 3500;

    // Lọc bài theo điều kiện
    const filtered = allProblems.filter(p => {
        // Kiểm tra điều kiện rating
        if (p.rating === undefined || p.rating < minRating || p.rating > maxRating) {
            return false;
        }

        // Kiểm tra điều kiện tag (nếu có chọn tag)
        if (selectedTags.size > 0) {
            const hasAllTags = Array.from(selectedTags).every(tag => p.tags.includes(tag));
            if (!hasAllTags) return false;
        }

        return true;
    });

    const resultCard = document.getElementById('resultCard');

    if (filtered.length === 0) {
        alert("Không tìm thấy bài tập nào phù hợp với bộ lọc này!");
        resultCard.classList.add('hidden');
        return;
    }

    // Random chọn 1 bài từ danh sách đã lọc
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    displayResult(chosen);
}

// Hiển thị kết quả ra màn hình
function displayResult(problem) {
    const resultCard = document.getElementById('resultCard');
    const titleEl = document.getElementById('problemTitle');
    const ratingEl = document.getElementById('problemRating');
    const tagsEl = document.getElementById('problemTags');
    const linkEl = document.getElementById('problemLink');

    titleEl.textContent = `${problem.contestId}${problem.index}. ${problem.name}`;
    ratingEl.textContent = `Rating: ${problem.rating || 'N/A'}`;
    tagsEl.textContent = `Tags: ${problem.tags.join(', ')}`;
    linkEl.href = `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;

    resultCard.classList.remove('hidden');
}

// Gắn sự kiện khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    initTags();
    fetchProblems();

    document.getElementById('randomBtn').addEventListener('click', handleRandom);
});