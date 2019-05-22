export default {
    questions: {
        "starting_branch": {
          "id": 27,
          "created_on": "2019-05-07 20:36:06",
          "text": "Is this an old or new symptom?",
          "is_outcome": false,
          "answers": [
            {
              "id": 43,
              "text": "New Symptom",
              "next_branch": {
                "id": 28,
                "created_on": "2019-05-07 20:37:28",
                "text": "Has the doctor/Nurse told you to expect this new symptom?",
                "is_outcome": false,
                "answers": [
                  {
                    "id": 45,
                    "text": "Yes –Expected symptom",
                    "next_branch": {
                      "id": 30,
                      "created_on": "2019-05-07 20:42:20",
                      "text": "Is there a DNR in place?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 47,
                          "text": "Yes",
                          "next_branch": {
                            "id": 34,
                            "created_on": "2019-05-07 20:48:45",
                            "text": "Expected Symptom\nExpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 30,
                            "created_on": "2019-05-07 20:42:20",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 47,
                                "text": "Yes",
                                "next_branch": 34,
                                "branch_id": 30
                              },
                              {
                                "id": 48,
                                "text": "No",
                                "next_branch": 35,
                                "branch_id": 30
                              }
                            ]
                          }
                        },
                        {
                          "id": 48,
                          "text": "No",
                          "next_branch": {
                            "id": 35,
                            "created_on": "2019-05-07 20:48:58",
                            "text": "Expected Symptom\nUnexpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 30,
                            "created_on": "2019-05-07 20:42:20",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 47,
                                "text": "Yes",
                                "next_branch": 34,
                                "branch_id": 30
                              },
                              {
                                "id": 48,
                                "text": "No",
                                "next_branch": 35,
                                "branch_id": 30
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "branch_id": {
                      "id": 28,
                      "created_on": "2019-05-07 20:37:28",
                      "text": "Has the doctor/Nurse told you to expect this new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 45,
                          "text": "Yes –Expected symptom",
                          "next_branch": {
                            "id": 30,
                            "created_on": "2019-05-07 20:42:20",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 47,
                                "text": "Yes",
                                "next_branch": 34,
                                "branch_id": 30
                              },
                              {
                                "id": 48,
                                "text": "No",
                                "next_branch": 35,
                                "branch_id": 30
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        },
                        {
                          "id": 46,
                          "text": "No –Unexpected symptom",
                          "next_branch": {
                            "id": 31,
                            "created_on": "2019-05-07 20:42:32",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 49,
                                "text": "Yes",
                                "next_branch": 36,
                                "branch_id": 31
                              },
                              {
                                "id": 50,
                                "text": "No",
                                "next_branch": 37,
                                "branch_id": 31
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "id": 46,
                    "text": "No –Unexpected symptom",
                    "next_branch": {
                      "id": 31,
                      "created_on": "2019-05-07 20:42:32",
                      "text": "Is there a DNR in place?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 49,
                          "text": "Yes",
                          "next_branch": {
                            "id": 36,
                            "created_on": "2019-05-07 20:49:11",
                            "text": "Unexpected Symptom\nExpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 31,
                            "created_on": "2019-05-07 20:42:32",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 49,
                                "text": "Yes",
                                "next_branch": 36,
                                "branch_id": 31
                              },
                              {
                                "id": 50,
                                "text": "No",
                                "next_branch": 37,
                                "branch_id": 31
                              }
                            ]
                          }
                        },
                        {
                          "id": 50,
                          "text": "No",
                          "next_branch": {
                            "id": 37,
                            "created_on": "2019-05-07 20:49:25",
                            "text": "Unexpected Symptom\nUnexpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 31,
                            "created_on": "2019-05-07 20:42:32",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 49,
                                "text": "Yes",
                                "next_branch": 36,
                                "branch_id": 31
                              },
                              {
                                "id": 50,
                                "text": "No",
                                "next_branch": 37,
                                "branch_id": 31
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "branch_id": {
                      "id": 28,
                      "created_on": "2019-05-07 20:37:28",
                      "text": "Has the doctor/Nurse told you to expect this new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 45,
                          "text": "Yes –Expected symptom",
                          "next_branch": {
                            "id": 30,
                            "created_on": "2019-05-07 20:42:20",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 47,
                                "text": "Yes",
                                "next_branch": 34,
                                "branch_id": 30
                              },
                              {
                                "id": 48,
                                "text": "No",
                                "next_branch": 35,
                                "branch_id": 30
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        },
                        {
                          "id": 46,
                          "text": "No –Unexpected symptom",
                          "next_branch": {
                            "id": 31,
                            "created_on": "2019-05-07 20:42:32",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 49,
                                "text": "Yes",
                                "next_branch": 36,
                                "branch_id": 31
                              },
                              {
                                "id": 50,
                                "text": "No",
                                "next_branch": 37,
                                "branch_id": 31
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              "branch_id": {
                "id": 27,
                "created_on": "2019-05-07 20:36:06",
                "text": "Is this an old or new symptom?",
                "is_outcome": false,
                "answers": [
                  {
                    "id": 43,
                    "text": "New Symptom",
                    "next_branch": {
                      "id": 28,
                      "created_on": "2019-05-07 20:37:28",
                      "text": "Has the doctor/Nurse told you to expect this new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 45,
                          "text": "Yes –Expected symptom",
                          "next_branch": {
                            "id": 30,
                            "created_on": "2019-05-07 20:42:20",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 47,
                                "text": "Yes",
                                "next_branch": 34,
                                "branch_id": 30
                              },
                              {
                                "id": 48,
                                "text": "No",
                                "next_branch": 35,
                                "branch_id": 30
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        },
                        {
                          "id": 46,
                          "text": "No –Unexpected symptom",
                          "next_branch": {
                            "id": 31,
                            "created_on": "2019-05-07 20:42:32",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 49,
                                "text": "Yes",
                                "next_branch": 36,
                                "branch_id": 31
                              },
                              {
                                "id": 50,
                                "text": "No",
                                "next_branch": 37,
                                "branch_id": 31
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "branch_id": {
                      "id": 27,
                      "created_on": "2019-05-07 20:36:06",
                      "text": "Is this an old or new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 43,
                          "text": "New Symptom",
                          "next_branch": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        },
                        {
                          "id": 44,
                          "text": "Old Symptom",
                          "next_branch": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "id": 44,
                    "text": "Old Symptom",
                    "next_branch": {
                      "id": 29,
                      "created_on": "2019-05-07 20:38:10",
                      "text": "Is there a DNR in place?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 51,
                          "text": "Yes",
                          "next_branch": {
                            "id": 32,
                            "created_on": "2019-05-07 20:47:53",
                            "text": "Expected Symptom\nExpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        },
                        {
                          "id": 52,
                          "text": "No",
                          "next_branch": {
                            "id": 33,
                            "created_on": "2019-05-07 20:48:08",
                            "text": "Expected Symptom\nUnexpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "branch_id": {
                      "id": 27,
                      "created_on": "2019-05-07 20:36:06",
                      "text": "Is this an old or new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 43,
                          "text": "New Symptom",
                          "next_branch": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        },
                        {
                          "id": 44,
                          "text": "Old Symptom",
                          "next_branch": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              "id": 44,
              "text": "Old Symptom",
              "next_branch": {
                "id": 29,
                "created_on": "2019-05-07 20:38:10",
                "text": "Is there a DNR in place?",
                "is_outcome": false,
                "answers": [
                  {
                    "id": 51,
                    "text": "Yes",
                    "next_branch": {
                      "id": 32,
                      "created_on": "2019-05-07 20:47:53",
                      "text": "Expected Symptom\nExpected Death",
                      "is_outcome": true,
                      "answers": []
                    },
                    "branch_id": {
                      "id": 29,
                      "created_on": "2019-05-07 20:38:10",
                      "text": "Is there a DNR in place?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 51,
                          "text": "Yes",
                          "next_branch": {
                            "id": 32,
                            "created_on": "2019-05-07 20:47:53",
                            "text": "Expected Symptom\nExpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        },
                        {
                          "id": 52,
                          "text": "No",
                          "next_branch": {
                            "id": 33,
                            "created_on": "2019-05-07 20:48:08",
                            "text": "Expected Symptom\nUnexpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "id": 52,
                    "text": "No",
                    "next_branch": {
                      "id": 33,
                      "created_on": "2019-05-07 20:48:08",
                      "text": "Expected Symptom\nUnexpected Death",
                      "is_outcome": true,
                      "answers": []
                    },
                    "branch_id": {
                      "id": 29,
                      "created_on": "2019-05-07 20:38:10",
                      "text": "Is there a DNR in place?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 51,
                          "text": "Yes",
                          "next_branch": {
                            "id": 32,
                            "created_on": "2019-05-07 20:47:53",
                            "text": "Expected Symptom\nExpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        },
                        {
                          "id": 52,
                          "text": "No",
                          "next_branch": {
                            "id": 33,
                            "created_on": "2019-05-07 20:48:08",
                            "text": "Expected Symptom\nUnexpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              },
              "branch_id": {
                "id": 27,
                "created_on": "2019-05-07 20:36:06",
                "text": "Is this an old or new symptom?",
                "is_outcome": false,
                "answers": [
                  {
                    "id": 43,
                    "text": "New Symptom",
                    "next_branch": {
                      "id": 28,
                      "created_on": "2019-05-07 20:37:28",
                      "text": "Has the doctor/Nurse told you to expect this new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 45,
                          "text": "Yes –Expected symptom",
                          "next_branch": {
                            "id": 30,
                            "created_on": "2019-05-07 20:42:20",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 47,
                                "text": "Yes",
                                "next_branch": 34,
                                "branch_id": 30
                              },
                              {
                                "id": 48,
                                "text": "No",
                                "next_branch": 35,
                                "branch_id": 30
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        },
                        {
                          "id": 46,
                          "text": "No –Unexpected symptom",
                          "next_branch": {
                            "id": 31,
                            "created_on": "2019-05-07 20:42:32",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 49,
                                "text": "Yes",
                                "next_branch": 36,
                                "branch_id": 31
                              },
                              {
                                "id": 50,
                                "text": "No",
                                "next_branch": 37,
                                "branch_id": 31
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "branch_id": {
                      "id": 27,
                      "created_on": "2019-05-07 20:36:06",
                      "text": "Is this an old or new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 43,
                          "text": "New Symptom",
                          "next_branch": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        },
                        {
                          "id": 44,
                          "text": "Old Symptom",
                          "next_branch": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  {
                    "id": 44,
                    "text": "Old Symptom",
                    "next_branch": {
                      "id": 29,
                      "created_on": "2019-05-07 20:38:10",
                      "text": "Is there a DNR in place?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 51,
                          "text": "Yes",
                          "next_branch": {
                            "id": 32,
                            "created_on": "2019-05-07 20:47:53",
                            "text": "Expected Symptom\nExpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        },
                        {
                          "id": 52,
                          "text": "No",
                          "next_branch": {
                            "id": 33,
                            "created_on": "2019-05-07 20:48:08",
                            "text": "Expected Symptom\nUnexpected Death",
                            "is_outcome": true,
                            "answers": []
                          },
                          "branch_id": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          }
                        }
                      ]
                    },
                    "branch_id": {
                      "id": 27,
                      "created_on": "2019-05-07 20:36:06",
                      "text": "Is this an old or new symptom?",
                      "is_outcome": false,
                      "answers": [
                        {
                          "id": 43,
                          "text": "New Symptom",
                          "next_branch": {
                            "id": 28,
                            "created_on": "2019-05-07 20:37:28",
                            "text": "Has the doctor/Nurse told you to expect this new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 45,
                                "text": "Yes –Expected symptom",
                                "next_branch": 30,
                                "branch_id": 28
                              },
                              {
                                "id": 46,
                                "text": "No –Unexpected symptom",
                                "next_branch": 31,
                                "branch_id": 28
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        },
                        {
                          "id": 44,
                          "text": "Old Symptom",
                          "next_branch": {
                            "id": 29,
                            "created_on": "2019-05-07 20:38:10",
                            "text": "Is there a DNR in place?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 51,
                                "text": "Yes",
                                "next_branch": 32,
                                "branch_id": 29
                              },
                              {
                                "id": 52,
                                "text": "No",
                                "next_branch": 33,
                                "branch_id": 29
                              }
                            ]
                          },
                          "branch_id": {
                            "id": 27,
                            "created_on": "2019-05-07 20:36:06",
                            "text": "Is this an old or new symptom?",
                            "is_outcome": false,
                            "answers": [
                              {
                                "id": 43,
                                "text": "New Symptom",
                                "next_branch": 28,
                                "branch_id": 27
                              },
                              {
                                "id": 44,
                                "text": "Old Symptom",
                                "next_branch": 29,
                                "branch_id": 27
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      },
    protocols: {"protocols": [
        {
          "id": 1,
          "sort": null,
          "name": "Josh",
          "starting_branch": {
            "id": 1,
            "created_on": "2019-04-29 23:06:27",
            "text": "Is Josh Beard-y?",
            "is_outcome": false,
            "answers": [
              {
                "id": 2,
                "text": "Yes",
                "next_branch": {
                  "id": 2,
                  "created_on": "2019-04-29 23:16:40",
                  "text": "You are correct.",
                  "is_outcome": true,
                  "answers": []
                },
                "branch_id": {
                  "id": 1,
                  "created_on": "2019-04-29 23:06:27",
                  "text": "Is Josh Beard-y?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 2,
                      "text": "Yes",
                      "next_branch": {
                        "id": 2,
                        "created_on": "2019-04-29 23:16:40",
                        "text": "You are correct.",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    },
                    {
                      "id": 3,
                      "text": "No",
                      "next_branch": {
                        "id": 13,
                        "created_on": "2019-05-01 23:20:04",
                        "text": "Why would you say that?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 4,
                            "text": "idk.",
                            "next_branch": 4,
                            "branch_id": 13
                          },
                          {
                            "id": 5,
                            "text": "because.",
                            "next_branch": 4,
                            "branch_id": 13
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    },
                    {
                      "id": 9,
                      "text": "Maybe",
                      "next_branch": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "id": 3,
                "text": "No",
                "next_branch": {
                  "id": 13,
                  "created_on": "2019-05-01 23:20:04",
                  "text": "Why would you say that?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 4,
                      "text": "idk.",
                      "next_branch": {
                        "id": 4,
                        "created_on": "2019-04-29 23:17:20",
                        "text": "okay fine.",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 13,
                        "created_on": "2019-05-01 23:20:04",
                        "text": "Why would you say that?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 4,
                            "text": "idk.",
                            "next_branch": 4,
                            "branch_id": 13
                          },
                          {
                            "id": 5,
                            "text": "because.",
                            "next_branch": 4,
                            "branch_id": 13
                          }
                        ]
                      }
                    },
                    {
                      "id": 5,
                      "text": "because.",
                      "next_branch": {
                        "id": 4,
                        "created_on": "2019-04-29 23:17:20",
                        "text": "okay fine.",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 13,
                        "created_on": "2019-05-01 23:20:04",
                        "text": "Why would you say that?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 4,
                            "text": "idk.",
                            "next_branch": 4,
                            "branch_id": 13
                          },
                          {
                            "id": 5,
                            "text": "because.",
                            "next_branch": 4,
                            "branch_id": 13
                          }
                        ]
                      }
                    }
                  ]
                },
                "branch_id": {
                  "id": 1,
                  "created_on": "2019-04-29 23:06:27",
                  "text": "Is Josh Beard-y?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 2,
                      "text": "Yes",
                      "next_branch": {
                        "id": 2,
                        "created_on": "2019-04-29 23:16:40",
                        "text": "You are correct.",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    },
                    {
                      "id": 3,
                      "text": "No",
                      "next_branch": {
                        "id": 13,
                        "created_on": "2019-05-01 23:20:04",
                        "text": "Why would you say that?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 4,
                            "text": "idk.",
                            "next_branch": 4,
                            "branch_id": 13
                          },
                          {
                            "id": 5,
                            "text": "because.",
                            "next_branch": 4,
                            "branch_id": 13
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    },
                    {
                      "id": 9,
                      "text": "Maybe",
                      "next_branch": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "id": 9,
                "text": "Maybe",
                "next_branch": {
                  "id": 8,
                  "created_on": "2019-05-01 18:00:40",
                  "text": "Maybe Branch, isn't it amazing?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 10,
                      "text": "Yes it is!!",
                      "next_branch": {
                        "id": 11,
                        "created_on": "2019-05-01 21:32:09",
                        "text": "You got it!",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      }
                    },
                    {
                      "id": 12,
                      "text": "Kinda",
                      "next_branch": {
                        "id": 9,
                        "created_on": "2019-05-01 18:03:23",
                        "text": "You chose: 'kinda'",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      }
                    },
                    {
                      "id": 14,
                      "text": "No it isn't!!",
                      "next_branch": {
                        "id": 14,
                        "created_on": "2019-05-01 23:21:55",
                        "text": "Are you sure?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 23,
                            "text": "Yes",
                            "next_branch": null,
                            "branch_id": 14
                          },
                          {
                            "id": 24,
                            "text": "No",
                            "next_branch": null,
                            "branch_id": 14
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      }
                    },
                    {
                      "id": 20,
                      "text": "Deep boi",
                      "next_branch": {
                        "id": 12,
                        "created_on": "2019-05-01 21:44:55",
                        "text": "Deep question?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 21,
                            "text": "For sure",
                            "next_branch": null,
                            "branch_id": 12
                          },
                          {
                            "id": 25,
                            "text": "Absolutely",
                            "next_branch": null,
                            "branch_id": 12
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      }
                    }
                  ]
                },
                "branch_id": {
                  "id": 1,
                  "created_on": "2019-04-29 23:06:27",
                  "text": "Is Josh Beard-y?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 2,
                      "text": "Yes",
                      "next_branch": {
                        "id": 2,
                        "created_on": "2019-04-29 23:16:40",
                        "text": "You are correct.",
                        "is_outcome": true,
                        "answers": []
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    },
                    {
                      "id": 3,
                      "text": "No",
                      "next_branch": {
                        "id": 13,
                        "created_on": "2019-05-01 23:20:04",
                        "text": "Why would you say that?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 4,
                            "text": "idk.",
                            "next_branch": 4,
                            "branch_id": 13
                          },
                          {
                            "id": 5,
                            "text": "because.",
                            "next_branch": 4,
                            "branch_id": 13
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    },
                    {
                      "id": 9,
                      "text": "Maybe",
                      "next_branch": {
                        "id": 8,
                        "created_on": "2019-05-01 18:00:40",
                        "text": "Maybe Branch, isn't it amazing?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 10,
                            "text": "Yes it is!!",
                            "next_branch": 11,
                            "branch_id": 8
                          },
                          {
                            "id": 12,
                            "text": "Kinda",
                            "next_branch": 9,
                            "branch_id": 8
                          },
                          {
                            "id": 14,
                            "text": "No it isn't!!",
                            "next_branch": 14,
                            "branch_id": 8
                          },
                          {
                            "id": 20,
                            "text": "Deep boi",
                            "next_branch": 12,
                            "branch_id": 8
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 1,
                        "created_on": "2019-04-29 23:06:27",
                        "text": "Is Josh Beard-y?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 2,
                            "text": "Yes",
                            "next_branch": 2,
                            "branch_id": 1
                          },
                          {
                            "id": 3,
                            "text": "No",
                            "next_branch": 13,
                            "branch_id": 1
                          },
                          {
                            "id": 9,
                            "text": "Maybe",
                            "next_branch": 8,
                            "branch_id": 1
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 4,
          "sort": null,
          "name": "Anxiety / Agitation",
          "starting_branch": {
            "id": 16,
            "created_on": "2019-05-03 22:58:51",
            "text": "Is this a good question?",
            "is_outcome": false,
            "answers": [
              {
                "id": 28,
                "text": "Yes if it's for anxiety.",
                "next_branch": null,
                "branch_id": {
                  "id": 16,
                  "created_on": "2019-05-03 22:58:51",
                  "text": "Is this a good question?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 28,
                      "text": "Yes if it's for anxiety.",
                      "next_branch": null,
                      "branch_id": {
                        "id": 16,
                        "created_on": "2019-05-03 22:58:51",
                        "text": "Is this a good question?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 28,
                            "text": "Yes if it's for anxiety.",
                            "next_branch": null,
                            "branch_id": 16
                          },
                          {
                            "id": 29,
                            "text": "No, I am now anxious.",
                            "next_branch": null,
                            "branch_id": 16
                          }
                        ]
                      }
                    },
                    {
                      "id": 29,
                      "text": "No, I am now anxious.",
                      "next_branch": null,
                      "branch_id": {
                        "id": 16,
                        "created_on": "2019-05-03 22:58:51",
                        "text": "Is this a good question?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 28,
                            "text": "Yes if it's for anxiety.",
                            "next_branch": null,
                            "branch_id": 16
                          },
                          {
                            "id": 29,
                            "text": "No, I am now anxious.",
                            "next_branch": null,
                            "branch_id": 16
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "id": 29,
                "text": "No, I am now anxious.",
                "next_branch": null,
                "branch_id": {
                  "id": 16,
                  "created_on": "2019-05-03 22:58:51",
                  "text": "Is this a good question?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 28,
                      "text": "Yes if it's for anxiety.",
                      "next_branch": null,
                      "branch_id": {
                        "id": 16,
                        "created_on": "2019-05-03 22:58:51",
                        "text": "Is this a good question?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 28,
                            "text": "Yes if it's for anxiety.",
                            "next_branch": null,
                            "branch_id": 16
                          },
                          {
                            "id": 29,
                            "text": "No, I am now anxious.",
                            "next_branch": null,
                            "branch_id": 16
                          }
                        ]
                      }
                    },
                    {
                      "id": 29,
                      "text": "No, I am now anxious.",
                      "next_branch": null,
                      "branch_id": {
                        "id": 16,
                        "created_on": "2019-05-03 22:58:51",
                        "text": "Is this a good question?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 28,
                            "text": "Yes if it's for anxiety.",
                            "next_branch": null,
                            "branch_id": 16
                          },
                          {
                            "id": 29,
                            "text": "No, I am now anxious.",
                            "next_branch": null,
                            "branch_id": 16
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 5,
          "sort": null,
          "name": "CADD Pump",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 6,
          "sort": null,
          "name": "Care Giver Distress",
          "starting_branch": {
            "id": 17,
            "created_on": "2019-05-03 23:05:38",
            "text": "Has there been a change in the client condition?",
            "is_outcome": false,
            "answers": [
              {
                "id": 30,
                "text": "Yes",
                "next_branch": {
                  "id": 18,
                  "created_on": "2019-05-03 23:06:26",
                  "text": "What is the most significant change?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 32,
                      "text": "Difficulty Swallowing Medication",
                      "next_branch": {
                        "id": 19,
                        "created_on": "2019-05-03 23:07:03",
                        "text": "Do you have injectable medication in the home?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 34,
                            "text": "Yes",
                            "next_branch": 20,
                            "branch_id": 19
                          },
                          {
                            "id": 35,
                            "text": "No",
                            "next_branch": 21,
                            "branch_id": 19
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 18,
                        "created_on": "2019-05-03 23:06:26",
                        "text": "What is the most significant change?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 32,
                            "text": "Difficulty Swallowing Medication",
                            "next_branch": 19,
                            "branch_id": 18
                          },
                          {
                            "id": 33,
                            "text": "Other physical change requiring additional level of care",
                            "next_branch": 22,
                            "branch_id": 18
                          }
                        ]
                      }
                    },
                    {
                      "id": 33,
                      "text": "Other physical change requiring additional level of care",
                      "next_branch": {
                        "id": 22,
                        "created_on": "2019-05-03 23:09:26",
                        "text": "Is the client EOL and goal to stay at home?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 37,
                            "text": "Yes",
                            "next_branch": 23,
                            "branch_id": 22
                          },
                          {
                            "id": 38,
                            "text": "No",
                            "next_branch": 26,
                            "branch_id": 22
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 18,
                        "created_on": "2019-05-03 23:06:26",
                        "text": "What is the most significant change?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 32,
                            "text": "Difficulty Swallowing Medication",
                            "next_branch": 19,
                            "branch_id": 18
                          },
                          {
                            "id": 33,
                            "text": "Other physical change requiring additional level of care",
                            "next_branch": 22,
                            "branch_id": 18
                          }
                        ]
                      }
                    }
                  ]
                },
                "branch_id": {
                  "id": 17,
                  "created_on": "2019-05-03 23:05:38",
                  "text": "Has there been a change in the client condition?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 30,
                      "text": "Yes",
                      "next_branch": {
                        "id": 18,
                        "created_on": "2019-05-03 23:06:26",
                        "text": "What is the most significant change?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 32,
                            "text": "Difficulty Swallowing Medication",
                            "next_branch": 19,
                            "branch_id": 18
                          },
                          {
                            "id": 33,
                            "text": "Other physical change requiring additional level of care",
                            "next_branch": 22,
                            "branch_id": 18
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 17,
                        "created_on": "2019-05-03 23:05:38",
                        "text": "Has there been a change in the client condition?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 30,
                            "text": "Yes",
                            "next_branch": 18,
                            "branch_id": 17
                          },
                          {
                            "id": 31,
                            "text": "No",
                            "next_branch": null,
                            "branch_id": 17
                          }
                        ]
                      }
                    },
                    {
                      "id": 31,
                      "text": "No",
                      "next_branch": null,
                      "branch_id": {
                        "id": 17,
                        "created_on": "2019-05-03 23:05:38",
                        "text": "Has there been a change in the client condition?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 30,
                            "text": "Yes",
                            "next_branch": 18,
                            "branch_id": 17
                          },
                          {
                            "id": 31,
                            "text": "No",
                            "next_branch": null,
                            "branch_id": 17
                          }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                "id": 31,
                "text": "No",
                "next_branch": null,
                "branch_id": {
                  "id": 17,
                  "created_on": "2019-05-03 23:05:38",
                  "text": "Has there been a change in the client condition?",
                  "is_outcome": false,
                  "answers": [
                    {
                      "id": 30,
                      "text": "Yes",
                      "next_branch": {
                        "id": 18,
                        "created_on": "2019-05-03 23:06:26",
                        "text": "What is the most significant change?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 32,
                            "text": "Difficulty Swallowing Medication",
                            "next_branch": 19,
                            "branch_id": 18
                          },
                          {
                            "id": 33,
                            "text": "Other physical change requiring additional level of care",
                            "next_branch": 22,
                            "branch_id": 18
                          }
                        ]
                      },
                      "branch_id": {
                        "id": 17,
                        "created_on": "2019-05-03 23:05:38",
                        "text": "Has there been a change in the client condition?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 30,
                            "text": "Yes",
                            "next_branch": 18,
                            "branch_id": 17
                          },
                          {
                            "id": 31,
                            "text": "No",
                            "next_branch": null,
                            "branch_id": 17
                          }
                        ]
                      }
                    },
                    {
                      "id": 31,
                      "text": "No",
                      "next_branch": null,
                      "branch_id": {
                        "id": 17,
                        "created_on": "2019-05-03 23:05:38",
                        "text": "Has there been a change in the client condition?",
                        "is_outcome": false,
                        "answers": [
                          {
                            "id": 30,
                            "text": "Yes",
                            "next_branch": 18,
                            "branch_id": 17
                          },
                          {
                            "id": 31,
                            "text": "No",
                            "next_branch": null,
                            "branch_id": 17
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 7,
          "sort": null,
          "name": "Constipation",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 8,
          "sort": null,
          "name": "Death",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 9,
          "sort": null,
          "name": "Dyspnea",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 10,
          "sort": null,
          "name": "Last Days",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 11,
          "sort": null,
          "name": "Last  Hours",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 12,
          "sort": null,
          "name": "Nausea / Vomiting",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 13,
          "sort": null,
          "name": "Pain",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        },
        {
          "id": 14,
          "sort": null,
          "name": "Terminal Bleed",
          "starting_branch": null,
          "main_id": {
            "id": 1
          }
        }
      ]},
    currentPatientIdx: -1,
    patients: [{
        id: 0,
        client: 'Apple Pasta',
        patient: 'Apple Pasta',
        phone: '778-868-9999',
        createdTime: '5:45 | 05/05/2019',
        timer: 0,
        relation: 'Dad',
        progressLoc: 3,
        progress: [[27, 43], [28, 45], [30, 47], [34, -1]]

    }, {
        id: 1,
        client: 'Melon Pizza',
        patient: 'Melon Pizza',
        phone: '778-868-8888',
        createdTime: '1:45 | 05/05/2019',
        timer: 0,
        relation: 'Mon',
        progressLoc: 2,
        progress: [[27, 44], [29, 51], [32, -1]]
    }, {
        id: 2,
        client: 'Banana Hotdog',
        patient: 'Banana Hotdog',
        phone: '778-868-7777',
        createdTime: '5:05 | 08/05/2019',
        timer: 0,
        relation: 'Friend',
        progressLoc: 2,
        progress: [[27, 44], [29, 52], [33, -1]]
    }]
};
