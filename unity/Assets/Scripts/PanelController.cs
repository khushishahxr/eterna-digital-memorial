using UnityEngine;
using UnityEngine.UI;

public class PanelController : MonoBehaviour
{
    public GameObject currentPanel;
    public GameObject nextPanel;
    public Button nextButton;

    void Start()
    {
        nextButton.onClick.AddListener(SwitchPanel);
        nextButton.interactable = false; // Disabled until a shape is selected
    }

    // Call this from TagBasedVisibility when model is selected
    public void EnableNextButton()
    {
        nextButton.interactable = true;
    }

    void SwitchPanel()
    {
        currentPanel.SetActive(false);
        nextPanel.SetActive(true);
    }
}
