package daemon

import (
	"fmt"

	"github.com/logrusorgru/aurora"
	"github.com/mesg-foundation/core/daemon"
	"github.com/spf13/cobra"
)

// Status command returns started services
var Status = &cobra.Command{
	Use:               "status",
	Short:             "Status of the daemon",
	Run:               statusHandler,
	DisableAutoGenTag: true,
}

func statusHandler(cmd *cobra.Command, args []string) {
	running, err := daemon.IsRunning()
	if err != nil {
		fmt.Println(aurora.Red(err))
		return
	}
	if running {
		fmt.Println(aurora.Green("Daemon is running"))
	} else {
		fmt.Println(aurora.Brown("Daemon is stopped"))
	}
}
