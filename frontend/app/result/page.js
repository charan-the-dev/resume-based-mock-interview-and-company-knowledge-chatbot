
"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function ResultPage() {
  // Mock interview data
  const results = [
    { questionNo: "Q1", question: "What is React?", correctAnswer: "A JavaScript library", isCorrect: true },
    { questionNo: "Q2", question: "What is JSX?", correctAnswer: "JavaScript XML", isCorrect: false },
    { questionNo: "Q3", question: "What is useState?", correctAnswer: "A React Hook", isCorrect: true },
    { questionNo: "Q4", question: "What is Next.js?", correctAnswer: "A React framework", isCorrect: false },
  ];

  // Prepare chart data
  const chartData = results.map((item, index) => ({
    questionNo: item.questionNo,
    Marks: index + 1,
    question: item.question,
    correctAnswer: item.correctAnswer,
    isCorrect: item.isCorrect,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 3px 8px rgba(1, 1, 1, 0.1)",
            fontSize: "14px",
            lineHeight: "1.4",
            maxWidth: "250px",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{label}</p>
          <p style={{ margin: "4px 0" }}>Question: {info.question}</p>
          <p style={{ margin: "4px 0" }}>Correct Answer: {info.correctAnswer}</p>
          <p style={{ margin: "4px 0" }}>Marks: {info.Marks}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend (green/red explanation)
  const CustomLegend = () => (
    <div style={styles.legendContainer}>
      <div style={styles.legendItem}>
        <div style={{ ...styles.legendBox, backgroundColor: "#4CAF50" }}></div>
        <span>Right Answer</span>
      </div>
      <div style={styles.legendItem}>
        <div style={{ ...styles.legendBox, backgroundColor: "#F44336" }}></div>
        <span>Wrong Answer</span>
      </div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Mock Interview Results</h2>

        <div style={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="questionNo"
                label={{ value: "Questions", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                domain={[0, 4]}
                ticks={[1, 2, 3, 4]}
                label={{ value: "Marks", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Marks" name="Marks" barSize={60}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCorrect ? "#4CAF50" : "#F44336"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <CustomLegend />
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    backgroundColor: "DAF1DE",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    backgroundColor: "lightgray",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#0e0d0dff",
  },
  chartWrapper: {
    width: "100%",
    height: "380px",
  },
  legendContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "15px",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "15px",
    color: "#000000ff",
  },
  legendBox: {
    width: "18px",
    height: "18px",
    borderRadius: "3px",
  },
};

